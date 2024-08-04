"use client";

import { Status, Task } from "@/types";
import colorBadge from "@/utils/colorBage";
import { UniqueIdentifier, useDraggable } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Center,
  Group,
  Stack,
  Title,
  Text,
  Flex,
  Badge,
  Divider,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { MdDragIndicator } from "react-icons/md";

export function Item({
  task: { description, id, title, status },
}: {
  task: Task;
}) {
  const [colorStatus, setColorStatus] = useState<Status>(status);
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useSortable({
      id: id,
    });

  useEffect(() => {
    setColorStatus(status);
    // console.log(colorStatus)
  }, [status]);

  const style = {
    transform: CSS.Translate.toString(transform),
    border: isDragging ? "1px solid #67e8f9 " : "",
    backgroundColor: !isDragging ? "black" : "rgba(103, 232, 249, 0.5) ",
  };
  return (
    <Group
      className="border border-cyan-300 rounded-md text-white p-2 w-full bg-black"
      align="center"
      wrap="nowrap"
      ref={setNodeRef}
      style={style}
    >
      <Center
        className="h-12 text-cyan-300 hover:bg-cyan-300/30 transition-all rounded-sm cursor-pointer"
        {...attributes}
        {...listeners}
      >
        <MdDragIndicator />
      </Center>
      <Divider size={"xs"} orientation="vertical" className=" border border-cyan-300 -ml-2" />
      <Stack gap={4} className="cursor-default w-full">
        <Flex justify={"space-between"} align={"center"} className="w-full">
          <Title order={4} className="  ">
            {title}
          </Title>
          <Badge color={colorBadge(colorStatus)} size="xs">
            {status}
          </Badge>
        </Flex>
        <Text style={{ fontSize: "12px" }}>{description}</Text>
      </Stack>
    </Group>
  );
}
