export type LinkGroup = {
    groupName: string;
    links: Link[];
};

export type Link = {
    label: string;
    url: string;
    model?: string;
};

export const linkGroups: LinkGroup[] = [
    {
        groupName: "Core Elements",
        links: [
            { label: "Worlds", url: "/worlds" },
            { label: "Campaigns", url: "/campaigns" },
            { label: "Acts", url: "/acts" },
            { label: "Adventures", url: "/adventures" },
            { label: "Beats", url: "/beats" },
        ],
    },
    {
        groupName: "Details",
        links: [
            { label: "Locations", url: "/locations" },
            { label: "Races", url: "/races" },
            { label: "Racial Traits", url: "/racialTraits" },
            { label: "Subraces", url: "/subraces" },
            { label: "Languages", url: "/languages" },
        ],
    },
    {
        groupName: "Character Development",
        links: [
            { label: "Classes", url: "/classes" },
            { label: "Class Features", url: "/classFeatures" },
            { label: "Backgrounds", url: "/backgrounds" },
            { label: "Proficiencies", url: "/proficiencies" },
            { label: "Feats", url: "/feats" },
            { label: "Characters", url: "/characters" },
        ],
    },
    {
        groupName: "Miscellaneous",
        links: [
            { label: "Spells", url: "/spells" },
            { label: "Items", url: "/items" },
        ],
    },
];
