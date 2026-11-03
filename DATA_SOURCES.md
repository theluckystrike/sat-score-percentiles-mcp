# Data sources

All sources were fetched on 2026-11-03 and parsed by `scripts/build_data.py` into `src/sat.data.ts`. No number was typed by hand.

| Data | URL | sha256 |
|---|---|---|
| SAT total and section percentiles (nationally representative and user group) | https://research.collegeboard.org/reports/sat-suite/understanding-scores/sat | 444013f51d4c6fbd1cbb6e9e19752e4b8cfc145c3bf77617c4beb88d31f42b3e |
| Class of 2026 national results (test takers, means, benchmarks, score bands, interquartile range) | https://reports.collegeboard.org/media/pdf/2026-total-group-sat-suite-of-assessments-annual-report-ada.pdf | a6294fbc8be7cd666a110b17e204ea9ba3b5b548a3beac1ce00b9359a33b7620 |
| Report index | https://reports.collegeboard.org/sat-suite-program-results | |

## State supplements (class of 2026)

Each row gives test takers, participation rate, mean total, Reading and Writing and Math, percent meeting benchmarks (SAT appendix "Total" row) and the 25th/50th/75th percentile scores (Interquartile Ranges page). The parser checks that the test-taker count on the participation page equals the appendix count for every state.

| File (https://reports.collegeboard.org/media/pdf/...) | sha256 |
|---|---|
| 2026-alabama-sat-suite-of-assessments-annual-report-ada_1.pdf | f4aa96673fe42a5038caba1488686b86eb07086eec31355122795371ab221954 |
| 2026-alaska-sat-suite-of-assessments-annual-report-ada.2.pdf | bfabc80815da13969fecc16743474a0fcb3d3b82239aa01ef5983c2e9dd990e4 |
| 2026-arizona-sat-suite-of-assessments-annual-report-ada.pdf | 64e998c3b2a35428f75fdcbfebe523a89579ed6cb4d89cc8437076a90c6adb73 |
| 2026-arkansas-sat-suite-of-assessments-annual-report-ada.2.pdf | bcc53f12e221c60bffa9b4dabc5c3724f79a622481344733f93bb50f0e752a4c |
| 2026-california-sat-suite-of-assessments-annual-report-ada_0.pdf | d2d67977b0c547668831aa2fa07a00575c867630262357f8214d8bdabbf6ce2d |
| 2026-colorado-sat-suite-of-assessments-annual-report-ada_0.pdf | 019138ddee16531c777177e6093da221ed813939614af939f564b7e8b5e76300 |
| 2026-connecticut-sat-suite-of-assessments-annual-report-ada.pdf | bddaa9839be15526f3967efb90543d2a016b6ae67329a4ddb4eb7b98182ef488 |
| 2026-delaware-sat-suite-of-assessments-annual-report-ada.pdf | 7a4c247642dd48f0c9082d006c919fa627fd1c64aa58dd1a5c91aaad6542013a |
| 2026-district-of-columbia-sat-suite-of-assessments-annual-report-ada.pdf | 8acc6af224208a05833921ca0a2d08d0c027b9b2fef23cbd30b7f33a55aa988c |
| 2026-florida-sat-suite-of-assessments-annual-report-ada.pdf | 2ca17d68b8eba23c8c71b9cafad12cda4f7d77630011a9da243b24462969eb27 |
| 2026-georgia-sat-suite-of-assessments-annual-report-ada.pdf | 78838b5781681f2cc400d8e04772630284e70027ac63091b9a31c0a4dac5449c |
| 2026-hawaii-sat-suite-of-assessments-annual-report-ada.pdf | 16969bea6009daddf482599593a86e021bbdb56bd224340cccd0fd4debd0cf70 |
| 2026-idaho-sat-suite-of-assessments-annual-report-ada.pdf | b30e79021b16c3000b3e2ac137d9d403efbf1ea8acf4523513750c33626fdcb9 |
| 2026-illinois-sat-suite-of-assessments-annual-report-ada.pdf | cc852207eca6f8811c2f64afcf6193bb97092d4092822ecf26fed89d28d9a43d |
| 2026-indiana-sat-suite-of-assessments-annual-report-ada.pdf | 0e781c321ce269e5445f9db899b318f8c01b36350a496f441f4e34676d39314d |
| 2026-iowa-sat-suite-of-assessments-annual-report-ada.pdf | 7961b78b3ed9334a7c1b8ea5aa286f74c0f4f4608e831dfbe7e90a1e41a17f19 |
| 2026-kansas-sat-suite-of-assessments-annual-report-ada.pdf | 74df8e0e214f92e8e4805cc0b21d8414e7b46dead7c453e1c3d3c21ce02e8db8 |
| 2026-kentucky-sat-suite-of-assessments-annual-report-ada_0.pdf | 596a3c3115511f7b0a1364016f7f6042e7523255aca5fc223f8b39069bece858 |
| 2026-louisiana-sat-suite-of-assessments-annual-report-ada.pdf | 1836ad5686c19b507982dd94b6e7fd2db43adc07d858b89adc003235659185c6 |
| 2026-maine-sat-suite-of-assessments-annual-report-ada.pdf | a61acda80eb97b0a8d57e311810901f420c66e60b2cbedc0bb50b35a4ecd7554 |
| 2026-maryland-sat-suite-of-assessments-annual-report-ada.pdf | 11f17d0463dd8a3c0d8958ee191f73f1526d3f3a566c334621e2142423029ede |
| 2026-massachusetts-sat-suite-of-assessments-annual-report-ada.pdf | cd832719f9299cb4a38552078a208e37664f128697fad3ffc650320dce1c8df7 |
| 2026-michigan-sat-suite-of-assessments-annual-report-ada.pdf | 36ec26288bb3a5263cd787d5b00b48a40f53831b80ea34d187be4a535795b482 |
| 2026-minnesota-sat-suite-of-assessments-annual-report-ada.pdf | 70701fa3c61c85f4951fe15615ae592cb003b2da335230ad3c0a3a5e8766a20c |
| 2026-mississippi-sat-suite-of-assessments-annual-report-ada.pdf | 61ca756f258688545d9ea53fb3a689fbf35c80300eb3d4d165962d9616824649 |
| 2026-missouri-sat-suite-of-assessments-annual-report.pdf | 11d305ad41a59af81a8503a667823d1db1aed9394a0579f5d2984cf5396467f4 |
| 2026-montana-sat-suite-of-assessments-annual-report-ada.pdf | 6be37ebe537c02cef706556a2f1edb04f7ae66e4cd7d813702c1dd1159578b7e |
| 2026-nebraska-sat-suite-of-assessments-annual-report.pdf | 7bfb23031feacfecbd22ca3c03fcbad220991727a5af559b3d4177c8f6e69b6c |
| 2026-nevada-sat-suite-of-assessments-annual-report.pdf | 004cb6b63e9ce2bc703216bcfd235bde2abf40acc51998a20eec3559a47cbdf4 |
| 2026-new-hampshire-sat-suite-of-assessments-annual-report.pdf | f74e84e0c581573d98ceb9213480beb39fdedd12107fb6bf20ed63c2325ab4f7 |
| 2026-new-jersey-sat-suite-of-assessments-annual-report.pdf | 813858287c14f94d9d751c13fbc55afac9c37adb4a81464674316d46cb6b6441 |
| 2026-new-mexico-sat-suite-of-assessments-annual-report.pdf | 7e978a46d305f2c41cd7b366b08aeba85a162c2da9e09d1d6c74219cb7c67ec5 |
| 2026-new-york-sat-suite-of-assessments-annual-report.pdf | 3f599b2657699efec9efa80b6c25373c466f653486c1f39198c582bd38a2afd2 |
| 2026-north-carolina-sat-suite-of-assessments-annual-report.pdf | 3f7b939a7619a737e6b0cc4efa3fd29e63ed3c062d28fdb464bcf807b3960520 |
| 2026-north-dakota-sat-suite-of-assessments-annual-report.pdf | 0d1a45368c316f48a221725296e923b634d2c1d41a7bad0c46faf2e065ff4f08 |
| 2026-ohio-sat-suite-of-assessments-annual-report.pdf | 4854bb88085bbe80b3d4fc966b243df26ac270f92c3e43629bec2cac45f76b7e |
| 2026-oklahoma-sat-suite-of-assessments-annual-report.pdf | c986a0142a1e8ae9e8ba186c23783cb5412dfcf80ddc3c8fc37ab5f3ac75eddc |
| 2026-oregon-sat-suite-of-assessments-annual-report.pdf | d24b7494c15729288d26142fc9d87630e3d47450f14378ce9d74cc2c2b2e66ba |
| 2026-pennsylvania-sat-suite-of-assessments-annual-report.pdf | adbac435b97809c042ca6699193f62c871fbb084c92b3af070b2e869852f559b |
| 2026-puerto-rico-sat-suite-of-assessments-annual-report.pdf | 9f4232a3b54b0671a139464fabc8367dc8c68b16405dc224f280e6bc570ca47b |
| 2026-rhode-island-sat-suite-of-assessments-annual-report.pdf | de469abf0f4ebb7fce00fc88c8c043fc29540cae4dd1c7d68c69f6731b3f8e83 |
| 2026-south-carolina-sat-suite-of-assessments-annual-report.pdf | 18514004721f7652154b5905d4d1def0bc011aeb1ea697f777e6ba268b1ae275 |
| 2026-south-dakota-sat-suite-of-assessments-annual-report.pdf | 902a627d1be2144836f5fc0d7a2f3374624be46511c2ed5e126cb407b5e1f17c |
| 2026-tennessee-sat-suite-of-assessments-annual-report.pdf | 2afdc2565e4c4a2460be707fdd305543cb85ad8aea911021cc36ee4f817d77ea |
| 2026-texas-sat-suite-of-assessments-annual-report.pdf | 9cfbedf49b27c314ef547fee53caade39d2b7bc870d4be869b6603e629618834 |
| 2026-us-virgin-islands-sat-suite-of-assessments-annual-report.pdf | 1942ab012c1e4c2ec7d292add9ffe691774e427ab7b5a796aa9ac550e132dcd7 |
| 2026-utah-sat-suite-of-assessments-annual-report.pdf | ea23c7721f20b99eacd42bb75aecc5f65aa7b2b28fe423448c2ffb52c0be333a |
| 2026-vermont-sat-suite-of-assessments-annual-report.pdf | dbf51edcf819cdd74b581df054b89e63a4eaf7cca5eea23d47c0834e231da566 |
| 2026-virginia-sat-suite-of-assessments-annual-report.pdf | 589bdd1ce13437a1ddc7f9d8cfacf2051b6f98557f83ecd15f4d544e875dde1e |
| 2026-washington-sat-suite-of-assessments-annual-report.pdf | 50a3e58c48486919dc8a3256f0fb65c6ed46c2384409f6794c17028f805120d5 |
| 2026-west-virginia-sat-suite-of-assessments-annual-report.pdf | ed3a64d22d6d4417c93112a2cc1bbd79398983b9f773cefcf96ba662827feca3 |
| 2026-wisconsin-sat-suite-of-assessments-annual-report.pdf | 05f4cb6411acea6c2d8e419448fd67b06bb37fe6da8e99eee89220f2a7145536 |
| 2026-wyoming-sat-suite-of-assessments-annual-report.pdf | fd6777e05cd6a5feba12d288f3e5fa54351deb6a162a80e2c45522a03f2bc874 |

The Ohio supplement was not linked from the report index on 2026-11-03. It answered 200 at the same path pattern (`2026-ohio-sat-suite-of-assessments-annual-report.pdf`) and parsed with the same checks.

To rebuild: download the files above into one folder (`percentiles.html`, `total.txt` from `pdftotext -layout` of the total group report, and `pdf/*.pdf`), then run `python3 -I scripts/build_data.py <folder> > src/sat.data.ts`.

College Board benchmarks (SAT RW 480, Math 530) and the list of states that give the SAT to all 11th graders (Colorado, Connecticut, Delaware, Indiana, Michigan, New Hampshire, New Mexico, Rhode Island, West Virginia) are from page 3 and 4 of every 2026 state supplement.
