"use client";

import { ReactFlow, Background, Controls, Node } from "@xyflow/react";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "./ui/context-menu";
import { useMemo } from "react";
import BasicNode from "./nodes/basic-node";
import "@xyflow/react/dist/style.css";

const FlowContextMenu = () => {
    return (
        <ContextMenuContent>
            <ContextMenuItem>Add</ContextMenuItem>
        </ContextMenuContent>
    );
};

export default function Flow({ nodes }: { nodes: Node[] }) {
    const nodeTypes = useMemo(() => ({ basicNode: BasicNode }), []);

    return (
        <div style={{ height: "100%" }} onContextMenu={(e) => e.preventDefault()}>
            <ContextMenu>
                <FlowContextMenu />
                <ContextMenuTrigger>
                    <ReactFlow nodeTypes={nodeTypes} nodes={nodes}>
                        <Background />
                        <Controls />
                    </ReactFlow>
                </ContextMenuTrigger>
            </ContextMenu>
        </div>
    );
}
