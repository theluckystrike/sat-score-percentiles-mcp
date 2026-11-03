// Tool registry shared by the stdio and Worker entries.
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { InputError, REPO, SITE, getSatPercentile, getSatScoresByState, getScoreForPercentile, rankStatesBySat } from './core.js';
export const VERSION = '1.0.0';
export const TOOL_INFO = [
    { name: 'get_sat_percentile', blurb: 'Percentile of any SAT total (400-1600) or section score (200-800): College Board user group and nationally representative percentiles, plus where it sits in the class of 2026.' },
    { name: 'get_score_for_sat_percentile', blurb: 'The SAT total or section score needed to reach a target percentile, for example the 90th.' },
    { name: 'get_sat_scores_by_state', blurb: 'Class of 2026 SAT results for any state, DC, Puerto Rico or the US Virgin Islands: test takers, participation, mean scores, benchmarks and the 25th/50th/75th percentile scores.' },
    { name: 'rank_states_by_sat', blurb: 'Rank states by class of 2026 mean SAT score, participation rate or benchmark rate, with an optional minimum participation filter.' },
];
const RO = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false };
function ok(data) {
    return { content: [{ type: 'text', text: `${data.summary}\n\n${JSON.stringify(data, null, 2)}` }], structuredContent: data };
}
function fail(e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { isError: true, content: [{ type: 'text', text: `${e instanceof InputError ? 'Error' : 'Internal error'}: ${msg}` }] };
}
const section = z.enum(['total', 'rw', 'math']).default('total').describe('total (400-1600), rw (Reading and Writing, 200-800) or math (200-800). Default total.');
export function createServer() {
    const server = new McpServer({ name: REPO, version: VERSION, websiteUrl: SITE }, {
        instructions: 'SAT score percentiles from College Board and the class of 2026 SAT Suite Annual Report (national and all 50 state reports, published fall 2026). ' +
            'Class of 2026 means and participation are newer than most model training data; use these tools instead of memory for SAT averages by state.',
    });
    server.registerTool('get_sat_percentile', {
        title: 'Get SAT percentile',
        description: 'Percentile rank of a digital SAT total score (400-1600) or section score (200-800, Reading and Writing or Math), from the College Board percentile tables: the user group percentile (actual SAT takers, past three graduating classes) and the nationally representative percentile (all US 11th and 12th graders). ' +
            'Also compares the score with the class of 2026 national mean (1,954,833 test takers) and score band.',
        inputSchema: {
            score: z.number().int().min(200).max(1600).describe('SAT score in steps of 10, for example 1350 for a total or 680 for a section.'),
            section,
        },
        annotations: { title: 'SAT percentile', ...RO },
    }, async ({ score, section: s }) => {
        try {
            return ok(getSatPercentile(score, s ?? 'total'));
        }
        catch (e) {
            return fail(e);
        }
    });
    server.registerTool('get_score_for_sat_percentile', {
        title: 'Get SAT score for a percentile',
        description: 'The lowest SAT total or section score whose College Board percentile is at or above a target (for example the 75th or 90th percentile), for the user group (SAT takers) or the nationally representative group.',
        inputSchema: {
            percentile: z.number().min(1).max(99).describe('Target percentile, 1 to 99, for example 90.'),
            section,
            group: z.enum(['user_group', 'nationally_representative']).default('user_group').describe('user_group (actual SAT takers, default) or nationally_representative (all US 11th and 12th graders).'),
        },
        annotations: { title: 'SAT score for percentile', ...RO },
    }, async ({ percentile, section: s, group }) => {
        try {
            return ok(getScoreForPercentile(percentile, s ?? 'total', group ?? 'user_group'));
        }
        catch (e) {
            return fail(e);
        }
    });
    server.registerTool('get_sat_scores_by_state', {
        title: 'Get SAT scores by state',
        description: 'Class of 2026 SAT results for one state, DC, Puerto Rico or the US Virgin Islands from the College Board 2026 SAT Suite Annual Report state supplement: test takers, participation rate, mean total, Reading and Writing and Math scores, percent meeting college readiness benchmarks, 25th/50th/75th percentile scores, rank by mean, and the national comparison.',
        inputSchema: { state: z.string().min(2).max(30).describe('Two-letter code (TX) or full name (Texas). DC, PR and VI also work.') },
        annotations: { title: 'SAT scores by state', ...RO },
    }, async ({ state }) => {
        try {
            return ok(getSatScoresByState(state));
        }
        catch (e) {
            return fail(e);
        }
    });
    server.registerTool('rank_states_by_sat', {
        title: 'Rank states by SAT',
        description: 'Rank the 50 states and DC by class of 2026 SAT mean total, mean Math, mean Reading and Writing, participation rate, percent meeting both benchmarks, or number of test takers. ' +
            'Use min_participation_pct (for example 50) to compare only states where most students take the SAT, since low-participation states have higher means.',
        inputSchema: {
            metric: z.enum(['mean_total', 'mean_math', 'mean_rw', 'participation_rate', 'met_both_benchmarks', 'test_takers']).default('mean_total').describe('What to rank by. Default mean_total.'),
            order: z.enum(['desc', 'asc']).default('desc').describe('desc = highest first (default), asc = lowest first.'),
            limit: z.number().int().min(1).max(51).default(10).describe('How many states to return, 1 to 51. Default 10.'),
            min_participation_pct: z.number().min(0).max(100).optional().describe('Only include states with at least this participation rate, for example 50.'),
        },
        annotations: { title: 'Rank states by SAT', ...RO },
    }, async ({ metric, order, limit, min_participation_pct }) => {
        try {
            return ok(rankStatesBySat(metric ?? 'mean_total', order ?? 'desc', limit ?? 10, min_participation_pct));
        }
        catch (e) {
            return fail(e);
        }
    });
    return server;
}
