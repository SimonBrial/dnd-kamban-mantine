"use client";

import { UniqueIdentifier, useDroppable } from "@dnd-kit/core";
import {
  Badge,
  Box,
  Container,
  ScrollArea,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { Item } from "./Item";
import {
  verticalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";

export default function ColumnContainer({
  columnTitle,
  columnId,
  tasks,
}: {
  columnId: UniqueIdentifier;
  columnTitle: string;
  tasks: any[];
}) {
  const { setNodeRef } = useDroppable({
    id: columnId,
  });
  return (
    <Container className="w-full max-w-full h-[100%] border border-cyan-300/50 rounded-md text-xl p-2 hover:bg-cyan-300/20 transition-all">
      <Title order={4} className="text-white text-center pb-2">
        {columnTitle} <Badge color="rgb(103 232 249)">{tasks.length}</Badge>
      </Title>
      <SortableContext
        id={`column-container-${columnId}`}
        items={tasks}
        strategy={verticalListSortingStrategy}
      >
        <ScrollArea
          h={"94%"}
          scrollbarSize={2}
          className=" bg-cyan-300/30 rounded-md"
        >
          <Stack
            className="w-full h-[95%] p-2" // Inside the column
            ref={setNodeRef}
          >
            {tasks.length === 0 ? (
              <Box className="font-bold text-center cursor-default rounded-md bg-cyan-300/30 py-2">
                <Text size="md" style={{ color: "white" }}>
                  Without Taks!
                </Text>
              </Box>
            ) : (
              <>
                {tasks.map((task) => (
                  <Item key={task.id} task={task} />
                ))}
              </>
            )}
          </Stack>
        </ScrollArea>
      </SortableContext>
    </Container>
  );
}
