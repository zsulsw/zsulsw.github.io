/*
 * List of news posts.  Each entry includes a slug (also used as the folder
 * name), a human‑readable date, a title, a short summary and the path to a
 * thumbnail image.  To add more news items simply append to this array and
 * create a corresponding folder under the `news` directory with a
 * `news.html` file and a `cover.jpg` image.  The slug should be a
 * chronological date (YYYYMMDD) so that sorting works naturally.
 */
window.newsList = [
  {
    slug: '20240901',
    date: '1 Sep 2024',
    title: 'Launch of WAAM Research Initiative',
    summary: 'Our team has secured a new research grant to advance the science and design of Wire Arc Additive Manufacturing (WAAM) steel structures.',
    image: 'news/20240901/cover.jpg'
  },
  {
    slug: '20251002',
    date: '2 Oct 2025',
    title: 'MSASect2 Version 2.0 Released',
    summary: 'The MSASect2 software has been upgraded to version 2.0, introducing improved buckling analysis algorithms and a streamlined user interface.',
    image: 'news/20251002/cover.jpg'
  },
  {
    slug: '20251003',
    date: '3 Oct 2025',
    title: 'New Publication in Structures',
    summary: 'Our latest paper on refined FE‑based cross‑section analysis for WAAM steel members has been accepted in the journal Structures.',
    image: 'news/20251003/cover.jpg'
  }
];