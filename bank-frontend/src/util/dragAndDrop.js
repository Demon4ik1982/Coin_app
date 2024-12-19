import { getDragAfterElement } from "./getDragAfterElement";

export function dragAndDpop(draggableContainer) {
  let draggedElement = null;

    draggableContainer.addEventListener("dragstart", (e) => {
      if (e.target.classList.contains("draggable-item")) {
        draggedElement = e.target;
        e.target.classList.add("dragging");
      }
    });

    draggableContainer.addEventListener("dragend", (e) => {
      if (draggedElement) {
        e.target.classList.remove("dragging");
        draggedElement = null;
      }
    });

    draggableContainer.addEventListener("dragover", (e) => {
      e.preventDefault();
      const afterElement = getDragAfterElement(draggableContainer, e.clientY);
      if (afterElement == null) {
        draggableContainer.appendChild(draggedElement);
      } else {
        draggableContainer.insertBefore(draggedElement, afterElement);
      }
    });
}
