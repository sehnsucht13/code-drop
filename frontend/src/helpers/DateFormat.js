const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "June",
  "July",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function formatDate(date) {
  let [month, day, year] = new Date(date)
    .toLocaleDateString("en-US")
    .split("/");
  console.log("Formatted date", month, day, year);
  return `${monthNames[month - 1]} ${day}, ${year}`;
}
