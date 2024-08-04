"use client";

import { Container, Flex, Text } from "@mantine/core";
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
  DragMoveEvent,
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
  if (container === "entregado") {
    return "entregado";
  }
  if (container === "generacion") {
    return "generacion";
  }
  if (container === "pagado") {
    return "pagado";
  }
  return "espera";
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
        status: getStatusFromContainer(overContainer), // Función para obtener el nuevo estado
      };
console.log(updatedTask)
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

  // console.log("boardSections: ", boardSections);

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

  /* const handleDragMove = ({ active, over }: DragMoveEvent) => {
    console.log("From handleDragMove --> active: ", active);
    console.log("From handleDragMove --> over: ", over);
  }; */

  const task = activeTaskId ? getTaskById(tasks, activeTaskId) : null;
  return (
    <main className="flex h-screen items-center justify-center flex-col gap-4 bg-black pt-4">
      <Flex
        className="w-full max-w-full"
        justify={"space-between"}
        align={"center"}
      >
        <Text
          style={{ color: "white", padding: "5px 10px" }}
          className="text-white font-bold border border-cyan-300 rounded-md shadow-md shadow-cyan-300/50 cursor-default w-20 p-2"
        >
          ID:
          {activeTaskId ? task?.id : null}
        </Text>
        <BtnContainer />
      </Flex>
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
          // onDragMove={handleDragMove}
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
