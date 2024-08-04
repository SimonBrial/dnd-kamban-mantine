import { Container } from "@mantine/core";
import Link from "next/link";

export default function BtnContainer() {
  return (
    <Container
      className="flex flex-row justify-end gap-4 max-w-full w-full"
      style={{ width: "100%", maxWidth: "100%" }}
    >
      <Link
        href={
          "https://codesandbox.io/p/sandbox/react-drag-drop-todo-rwn8d3?file=%2Fsrc%2Fcomponents%2FBoardSectionList.tsx"
        }
        target="_blank"
        className="text-sm text-cyan-300 px-4 py-2 border border-cyan-300 rounded-md hover:bg-cyan-200/30 transition-all"
      >
        CODESAND BOX
      </Link>
      <Link
        href={"https://dndkit.com/"}
        target="_blank"
        className="text-sm text-cyan-300 px-4 py-2 border border-cyan-300 rounded-md hover:bg-cyan-200/30 transition-all"
      >
        DND - Kit Docs
      </Link>
      <Link
        href={"https://mantine.dev/"}
        target="_blank"
        className="text-sm text-cyan-300 px-4 py-2 border border-cyan-300 rounded-md hover:bg-cyan-200/30 transition-all"
      >
        Mantine UI
      </Link>
    </Container>
  );
}
