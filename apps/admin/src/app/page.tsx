import Flow from "@/components/flow";
import { Node } from "@xyflow/react";

const nodes: Node[] = [
    {
        id: "1",
        position: { x: 0, y: 0 },
        data: { value: "Hello" },
        type: "basicNode",
    },
];

export default function Home() {
    return <Flow nodes={nodes} />;
}
