import { FormType } from "../../helpers/object.helper";

export default function Activities() {
  const begin = new Date();
  begin.setDate(1);
  begin.setDate(begin.getDate() - begin.getDay());
  const end = new Date();
  end.setDate(1);
  end.setMonth(end.getMonth() + 1);
  end.setDate(end.getDate() - 1);
  const calendarMap = [];
  while (begin <= end) {
    calendarMap.push(structuredClone(begin));
    begin.setDate(begin.getDate() + 1);
  }
  while (calendarMap.length % 7 !== 0) {
    calendarMap.push(structuredClone(begin));
    begin.setDate(begin.getDate() + 1);
  }
  const renderUi = [];
  let tempUi = [];
  for (let i = 0; i < calendarMap.length / 7; i++) {
    for (let j = 0; j < 7; j++) {
      tempUi.push(
        <td
          class={
            calendarMap[i * 7 + j].getMonth() !== new Date().getMonth()
              ? "no-relates"
              : "relate"
          }
          style={{ backgroundColor: "#e9eafa" }}
          id={calendarMap[i * 7 + j]}
        >
          {calendarMap[i * 7 + j].getDate()}
        </td>
      );
    }
    renderUi.push(<tr>{tempUi}</tr>);
    tempUi = [];
  }
  return (
    <>
      <div class="w-100">
        <div class="calendar__title text-center" style={{ fontWeight: "bold" }}>
          {new Date().toUTCString().split(" ")[1] +
            "-" +
            new Date().toUTCString().split(" ")[2] +
            "," +
            new Date().toUTCString().split(" ")[3]}
        </div>
        <table class="w-100 mt-3 table-bordered" style={{ fontSize: "12px" }}>
          <tr>
            <th class="text-danger">Sun</th>
            <th>Mon</th>
            <th>Tue</th>
            <th>Wed</th>
            <th>Thu</th>
            <th>Fri</th>
            <th>Sat</th>
          </tr>
          {renderUi}
        </table>
        <div class="noti mt-3 d-flex justify-content-center">
          <div
            class="mx-1 text-white text-center"
            style={{
              width: "70px",
              height: "20px",
              backgroundColor: "#2c31cf",
              fontSize: "12px",
              border: "1px solid #000",
            }}
          >
            Positive
          </div>
          <div
            class=" mx-1 text-dark text-center"
            style={{
              width: "70px",
              height: "20px",
              backgroundColor: "#6b6edd",
              fontSize: "12px",
              border: "1px solid #000",
            }}
          >
            Normal
          </div>
          <div
            class="mx-1 text-dark text-center"
            style={{
              width: "70px",
              height: "20px",
              fontSize: "12px",
              backgroundColor: "#e9eafa",
              border: "1px solid #000",
            }}
          >
            Not active
          </div>
        </div>
      </div>
    </>
  );
}
