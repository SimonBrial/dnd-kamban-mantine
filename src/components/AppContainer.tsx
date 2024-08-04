"use client";

import { Container } from "@mantine/core";
import BtnContainer from "./BtnContainer";
import ColumnContainer from "./ColumnContainer";
import { BOARD_SECTIONS } from "@/constans";
import {
  defaultDropAnimation,
  DragStartEvent,
  KeyboardSensor,
  closestCorners,
  DragOverEvent,
  PointerSensor,
  DropAnimation,
  DragEndEvent,
  DragOverlay,
  useSensors,
  DndContext,
  useSensor,
} from "@dnd-kit/core";
import { Item } from "./Item";
import capitalize from "@/utils/capitalize";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { getTaskById } from "@/utils/tasks";
import { useState } from "react";
import { BoardSectionsType, Status, Task } from "@/types";
import { findBoardSectionContainer, initializeBoard } from "@/utils/board";
import { DATA } from "@/data";

const getStatusFromContainer = (container: string): Status => {
  const statusArray: Status[] = ["entregado", "espera", "generacion", "pagado"];
  if (!statusArray.includes(container as Status)) {
    return "espera";
  }
  return container as Status;
};

export default function AppContainer() {
  const tasks = DATA;
  const initialBoardSections = initializeBoard(DATA);
  const [boardSections, setBoardSections] =
    useState<BoardSectionsType>(initialBoardSections);
  const [activeTaskId, setActiveTaskId] = useState<null | string>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const dropAnimation: DropAnimation = {
    ...defaultDropAnimation,
  };

  // ✅ When the user drag the item, this function is called
  const handleDragStart = ({ active }: DragStartEvent) => {
    // console.log("from handleDragStart", active);
    setActiveTaskId(active.id as string);
  };
  // When the user is on the container (same container or next container), this function is called
  const handleDragOver = ({ active, over }: DragOverEvent) => {
    // 1. Find the containers
    const activeContainer = findBoardSectionContainer(
      boardSections,
      active.id as string,
    );
    const overContainer = findBoardSectionContainer(
      boardSections,
      over?.id as string,
    );
    // if the item didn't move to a new container
    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      return;
    }

    // 2. Update the container status
    setBoardSections((boardSection) => {
      const activeItems = boardSections[activeContainer];
      const overItems = boardSections[overContainer];
      // Find the index for the items
      const activeIndex = activeItems.findIndex(
        (item) => item.id === active.id,
      );
      const overIndex = overItems.findIndex((item) => item.id !== over?.id);

      const updatedTask = {
        ...boardSection[activeContainer][activeIndex],
        status: getStatusFromContainer(overContainer), // Function to get the new state
      };
      // TODO: console.log(updatedTask) --> When the app needs to send the information about the user that had updated, with this variable can do it.
      return {
        ...boardSection,
        [activeContainer]: [
          ...boardSection[activeContainer].filter(
            (item) => item.id !== active.id,
          ),
        ],
        [overContainer]: [
          ...boardSection[overContainer].slice(0, overIndex),
          updatedTask,
          ...boardSection[overContainer].slice(
            overIndex,
            boardSection[overContainer].length,
          ),
        ],
      };
    });
  };

  // When the user is on the container (same container or next container) and drag the item in the another container, this function is called
  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    const activeContainer = findBoardSectionContainer(
      boardSections,
      active.id as string,
    );
    const overContainer = findBoardSectionContainer(
      boardSections,
      over?.id as string,
    );
    if (
      !activeContainer ||
      !overContainer ||
      activeContainer !== overContainer
    ) {
      return;
    }
    // Item active inside the container/ Item dragging
    const activeIndex = boardSections[activeContainer].findIndex(
      (item: Task) => item.id === active.id,
    );
    // Item that inside the containers being flown over
    const overIndex = boardSections[overContainer].findIndex(
      (item: Task) => item.id === over?.id,
    );
    if (activeIndex !== overIndex) {
      // If the item change the position in the container, the postion in the array will be updated
      setBoardSections((boardSection) => ({
        ...boardSection,
        [overContainer]: arrayMove(
          boardSection[overContainer],
          activeIndex,
          overIndex,
        ),
      }));
    }

    setActiveTaskId(null);
  };

  const task = activeTaskId ? getTaskById(tasks, activeTaskId) : null;
  return (
    <main className="flex h-screen items-center justify-center flex-col gap-4 bg-black pt-4">
      <BtnContainer />
      <Container
        className="flex gap-4 w-full max-w-full, h-[90%]"
        style={{ width: "100%", maxWidth: "100%" }}
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          {Object.keys(boardSections).map((columnKey) => (
            <ColumnContainer
              columnId={columnKey}
              key={columnKey}
              columnTitle={capitalize(columnKey)}
              tasks={boardSections[columnKey]}
            />
          ))}
          <DragOverlay dropAnimation={dropAnimation}>
            {task ? <Item task={task} /> : null}
          </DragOverlay>
        </DndContext>
      </Container>
    </main>
  );
}
