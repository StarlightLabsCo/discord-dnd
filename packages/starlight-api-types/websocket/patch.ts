import z from "zod";

const AddOperationSchema = z.object({
    op: z.literal("add"),
    path: z.string(),
    value: z.any(), // 'value' is required for 'add'
});

const RemoveOperationSchema = z.object({
    op: z.literal("remove"),
    path: z.string(),
});

const ReplaceOperationSchema = z.object({
    op: z.literal("replace"),
    path: z.string(),
    value: z.any(), // 'value' is required for 'replace'
});

const MoveOperationSchema = z.object({
    op: z.literal("move"),
    path: z.string(),
    from: z.string(), // 'from' is required for 'move'
});

const CopyOperationSchema = z.object({
    op: z.literal("copy"),
    path: z.string(),
    from: z.string(), // 'from' is required for 'copy'
});

const TestOperationSchema = z.object({
    op: z.literal("test"),
    path: z.string(),
    value: z.any(), // 'value' is required for 'test'
});

export const JsonPatchOperationSchema = z.union([
    AddOperationSchema,
    RemoveOperationSchema,
    ReplaceOperationSchema,
    MoveOperationSchema,
    CopyOperationSchema,
    TestOperationSchema,
]);

export const JsonPatchDocumentSchema = z.array(JsonPatchOperationSchema);

export type JsonPatchOperation = z.infer<typeof JsonPatchOperationSchema>;
export type JsonPatchDocument = z.infer<typeof JsonPatchDocumentSchema>;
