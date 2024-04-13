import { Handle, Position } from "@xyflow/react";
import React from "react";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "../ui/context-menu";
import "@xyflow/react/dist/style.css";

type Props = {};

const NodeContextMenu = () => {
    return (
        <ContextMenuContent>
            <ContextMenuItem>Edit</ContextMenuItem>
            <ContextMenuItem>Duplicate</ContextMenuItem>
            <ContextMenuItem>Delete</ContextMenuItem>
        </ContextMenuContent>
    );
};

export default function BasicNode({}: Props) {
    return (
        <ContextMenu>
            <ContextMenuTrigger>
                <NodeContextMenu />
                <Handle type="target" position={Position.Top} />
                <Handle type="target" position={Position.Left} />
                <Handle type="target" position={Position.Right} />
                <div className="p-6 rounded-md bg-neutral-700">
                    <label htmlFor="text">Text:</label>
                </div>
                <Handle type="source" position={Position.Bottom} />
            </ContextMenuTrigger>
        </ContextMenu>
    );
}
