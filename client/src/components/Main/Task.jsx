import { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import TaskModal from "../../modals/TaskModal";

export function Task({ task, index }) {
  const [isTaskModalVisible, setIsTaskModalVisible] = useState(false);

  const numCompletedSubtasks = getNumCompletedSubtasks();

  function getNumCompletedSubtasks() {
    let count = 0;
    task.subtasks.forEach((subtask) => (subtask.isCompleted ? count++ : null));
    return count;
  }

  return (
    <>
      {/* credit to https://dev.to/imjoshellis/codealong-multi-column-drag-and-drop-in-react-3781 */}
      <Draggable draggableId={task.taskName} index={index}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            {/* Task Card */}
            <div
              onClick={() => setIsTaskModalVisible(true)}
              className="cursor-pointer dark:bg-zinc-800 hover:dark:bg-zinc-700 flex flex-col my-3 bg-gray-50 hover:bg-gray-100 shadow-md p-3 h-40 w-60 rounded-lg hover:shadow-lg"
            >
              <p className="text-gray-900 font-bold py-2 dark:text-zinc-200  ">
                {task.taskName}
              </p>
              <p className="text-gray-400 font-bold text-xs py-2 ">{`${numCompletedSubtasks} of ${task.subtasks.length} subtasks`}</p>
            </div>
          </div>
        )}
      </Draggable>

      {/* Task Modal */}
      <div className={`${isTaskModalVisible ? "block" : "hidden"}`}>
        <TaskModal
          key={task.title}
          setIsTaskModalVisible={setIsTaskModalVisible}
          isTaskModalVisible={isTaskModalVisible}
          task={task}
          numCompletedSubtasks={numCompletedSubtasks}
        />
      </div>
    </>
  );
}
