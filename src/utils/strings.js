export const displayDate = (date) => {
    let month = date.getMonth();
    let day = date.getDate();
    let hour = date.getHours();
    let min = date.getMinutes();
    let pm = hour > 11;

    return (month + 1) + "/" + (day) + " " + (hour % 12) + ":" + ((min<10?'0':'') + min) + " " + (pm ? "PM" : "AM");
}