import { Droppable } from "react-beautiful-dnd";
import { Task } from "./Task";

export default function Column({ column, index }) {
  const taskElements = column.tasks.map((task, index) => (
    <Task key={task.taskName} task={task} index={index} />
  ));

  function circle() {
    if (index % 2 === 0) {
      return "bg-cyan-400";
    } else if (index % 2 === 1) {
      return "bg-violet-500";
    }
  }

  return (
    //credit to https://dev.to/imjoshellis/codealong-multi-column-drag-and-drop-in-react-3781
    <Droppable droppableId={column.columnName}>
      {(provided) => (
        <div {...provided.droppableProps} ref={provided.innerRef}>
          <div className="flex items-center gap-2 mb-5 w-60 pt-10">
            <div className={`${circle()} h-4 w-4 rounded-full `}></div>
            <p className="uppercase text-gray-500 font-semibold tracking-wider text-sm">
              {column.columnName} ({column.tasks.length})
            </p>
          </div>

          {column.tasks.length === 0 && (
            <div className="rounded-lg  h-screen w-60 border-4 border-dashed border-gray-300"></div>
          )}

          <div>{taskElements}</div>

          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}
