import { createFileRoute } from "@tanstack/react-router";

import { SelectableGrid } from "@/components/lobby/character/SelectableGrid";

export const Route = createFileRoute("/_layout/lobby/character/_layout/origin")(
    {
        component: Origin,
    }
);

function Origin() {
    // const selectedCampaign = useGameStore(
    //     (state) => state.state?.selectedCampaign
    // );

    // const items = Object.values(origins).map((origin) => ({
    //     id: origin.id,
    //     src: origin.src,
    //     title: origin.title,
    // }));

    const custom = {
        id: "custom",
        src: "",
        title: "Custom",
    };

    const items = [custom];

    return (
        <SelectableGrid
            items={items}
            selected={"custom"}
            setSelected={() => {}}
            columns={3}
        />
    );
}
