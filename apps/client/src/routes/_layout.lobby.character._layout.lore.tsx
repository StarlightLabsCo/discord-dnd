import { useCharacterEditorStore } from "@/lib/game/characterEditor";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/lobby/character/_layout/lore")({
    component: Lore,
});

function Lore() {
    const {
        draftCharacter,
        setDraftCharacter,
        generatingCharacter,
        generateCharacter,
    } = useCharacterEditorStore();

    const generationEnabled =
        draftCharacter &&
        draftCharacter.name &&
        draftCharacter.pronouns &&
        draftCharacter.age &&
        draftCharacter.voice &&
        draftCharacter.alignment &&
        draftCharacter.appearance &&
        draftCharacter.backstory &&
        draftCharacter.personalityTraits &&
        draftCharacter.ideals &&
        draftCharacter.bonds &&
        draftCharacter.flaws &&
        !generatingCharacter;

    const updateDraftCharacter = (field: string, value: string | number) => {
        if (!draftCharacter) return;
        setDraftCharacter({ ...draftCharacter, [field]: value });
    };

    return (
        <div className='flex flex-col gap-y-[0.8vh] w-full h-full justify-start text-[0.8vw] pr-[1vw]'>
            <div className='flex'>
                <div className='flex flex-col gap-y-[0.2vh]'>
                    <label>Name</label>
                    <input
                        type='text'
                        value={draftCharacter?.name || ""}
                        onChange={(e) =>
                            updateDraftCharacter("name", e.target.value)
                        }
                        className='bg-transparent border-white border-[0.1vw] p-[0.5vw]'
                    />
                </div>
            </div>
            <div className='flex justify-evenly gap-x-[1vw]'>
                <div className='flex flex-col gap-y-[0.2vh] w-1/4'>
                    <label>Pronouns</label>
                    <input
                        type='text'
                        value={draftCharacter?.pronouns || ""}
                        onChange={(e) =>
                            updateDraftCharacter("pronouns", e.target.value)
                        }
                        className='bg-transparent border-white border-[0.1vw] p-[0.5vw] w-full'
                    />
                </div>
                <div className='flex flex-col gap-y-[0.2vh] w-1/4'>
                    <label>Age</label>
                    <input
                        type='text'
                        value={draftCharacter?.age || ""}
                        onChange={(e) =>
                            updateDraftCharacter("age", Number(e.target.value))
                        }
                        className='bg-transparent border-white border-[0.1vw] p-[0.5vw] w-full'
                    />
                </div>
                <div className='flex flex-col gap-y-[0.2vh] w-1/4'>
                    <label>Voice</label>
                    <input
                        type='text'
                        value={draftCharacter?.voice || ""}
                        onChange={(e) =>
                            updateDraftCharacter("voice", e.target.value)
                        }
                        className='bg-transparent border-white border-[0.1vw] p-[0.5vw] w-full'
                    />
                </div>
                <div className='flex flex-col gap-y-[0.2vh] w-1/4'>
                    <label>Alignment</label>
                    <input
                        type='text'
                        value={draftCharacter?.alignment || ""}
                        onChange={(e) =>
                            updateDraftCharacter("alignment", e.target.value)
                        }
                        className='bg-transparent border-white border-[0.1vw] p-[0.5vw] w-full'
                    />
                </div>
            </div>
            <div className='flex justify-evenly gap-x-[1vw]'>
                <div className='flex flex-col gap-y-[0.2vh] w-1/2'>
                    <label>Appearance</label>
                    <textarea
                        value={draftCharacter?.appearance || ""}
                        onChange={(e) =>
                            updateDraftCharacter("appearance", e.target.value)
                        }
                        className='bg-transparent border-white border-[0.1vw] p-[0.5vw] w-full h-[10vh]'
                    />
                </div>
                <div className='flex flex-col gap-y-[0.2vh] w-1/2'>
                    <label>Backstory</label>
                    <textarea
                        value={draftCharacter?.backstory || ""}
                        onChange={(e) =>
                            updateDraftCharacter("backstory", e.target.value)
                        }
                        className='bg-transparent border-white border-[0.1vw] p-[0.5vw] w-full h-[10vh]'
                    />
                </div>
            </div>
            <div className='flex justify-evenly gap-x-[1vw]'>
                <div className='flex flex-col gap-y-[0.2vh] w-full'>
                    <label>Personality Traits</label>
                    <textarea
                        value={draftCharacter?.personalityTraits || ""}
                        onChange={(e) =>
                            updateDraftCharacter("personality", e.target.value)
                        }
                        className='bg-transparent border-white border-[0.1vw] p-[0.5vw] w-3/5 h-[10vh]'
                    />
                </div>
            </div>
            <div className='flex justify-evenly gap-x-[1vw]'>
                <div className='flex flex-col gap-y-[0.2vh] w-1/3'>
                    <label>Ideals</label>
                    <textarea
                        value={draftCharacter?.ideals || ""}
                        onChange={(e) =>
                            updateDraftCharacter("ideals", e.target.value)
                        }
                        className='bg-transparent border-white border-[0.1vw] p-[0.5vw] w-full h-[5vh]'
                    />
                </div>
                <div className='flex flex-col gap-y-[0.2vh] w-1/3'>
                    <label>Bonds</label>
                    <textarea
                        value={draftCharacter?.bonds || ""}
                        onChange={(e) =>
                            updateDraftCharacter("bonds", e.target.value)
                        }
                        className='bg-transparent border-white border-[0.1vw] p-[0.5vw] w-full h-[5vh]'
                    />
                </div>
                <div className='flex flex-col gap-y-[0.2vh] w-1/3'>
                    <label>Flaws</label>
                    <textarea
                        value={draftCharacter?.flaws || ""}
                        onChange={(e) =>
                            updateDraftCharacter("flaws", e.target.value)
                        }
                        className='bg-transparent border-white border-[0.1vw] p-[0.5vw] w-full h-[5vh]'
                    />
                </div>
            </div>
            <button
                onClick={generateCharacter}
                className={`mt-[8vh] self-center px-[1.25vw] py-[0.5vw] w-1/3 rounded border ${generationEnabled ? "text-white border-white hover:scale-105" : "text-neutral-400 border-neutral-400"}`}
                disabled={!generationEnabled}
            >
                {generatingCharacter ? "Generating..." : "Generate Character"}
            </button>
        </div>
    );
}
