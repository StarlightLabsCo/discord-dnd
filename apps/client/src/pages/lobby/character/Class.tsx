import { SelectableGrid } from "./SelectableGrid";
import { useGameStore } from "@/game";
import { races } from "@/assets/images/portraits/races";

export function Class() {
    const selectedRaceIndex = useGameStore((state) => state.character.race);
    const selectedRaceKey = Object.keys(races)[
        selectedRaceIndex
    ] as keyof typeof races;
    const selectedRaceImages = races[selectedRaceKey].classes;

    const classes = [
        {
            title: "Barbarian",
            subtitle: "",
            src: selectedRaceImages.barbarian,
        },
        {
            title: "Bard",
            subtitle: "",
            src: selectedRaceImages.bard,
        },
        {
            title: "Cleric",
            subtitle: "",
            src: selectedRaceImages.cleric,
        },
        {
            title: "Druid",
            subtitle: "",
            src: selectedRaceImages.druid,
        },
        {
            title: "Fighter",
            subtitle: "",
            src: selectedRaceImages.fighter,
        },
        {
            title: "Monk",
            subtitle: "",
            src: selectedRaceImages.monk,
        },
        {
            title: "Paladin",
            subtitle: "",
            src: selectedRaceImages.paladin,
        },
        {
            title: "Ranger",
            subtitle: "",
            src: selectedRaceImages.ranger,
        },
        {
            title: "Rogue",
            subtitle: "",
            src: selectedRaceImages.rogue,
        },
        {
            title: "Sorcerer",
            subtitle: "",
            src: selectedRaceImages.sorcerer,
        },
        {
            title: "Warlock",
            subtitle: "",
            src: selectedRaceImages.warlock,
        },
        {
            title: "Wizard",
            subtitle: "",
            src: selectedRaceImages.wizard,
        },
    ];

    const selected = useGameStore((state) => state.character.class);
    const setSelected = (index: number) => {
        useGameStore.setState({
            character: {
                ...useGameStore.getState().character,
                class: index,
            },
        });
    };

    return (
        <SelectableGrid
            items={classes}
            selected={selected}
            setSelected={setSelected}
            columns={4}
        />
    );
}
