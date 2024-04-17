import { useCharacterStore } from "@/lib/game/character";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/lobby/character/_layout/lore")({
    component: Lore,
});

function Lore() {
    const {
        name,
        setName,
        pronouns,
        setPronouns,
        age,
        setAge,
        voice,
        setVoice,
        alignment,
        setAlignment,
        appearance,
        setAppearance,
        backstory,
        setBackstory,
        personality,
        setPersonality,
        ideals,
        setIdeals,
        bonds,
        setBonds,
        flaws,
        setFlaws,
        generateCharacter,
        generatingCharacter,
    } = useCharacterStore();

    const generationEnabled =
        name &&
        pronouns &&
        age &&
        voice &&
        alignment &&
        appearance &&
        backstory &&
        personality &&
        ideals &&
        bonds &&
        flaws &&
        !generatingCharacter;

    return (
        <div className='flex flex-col gap-y-[0.8vh] w-full h-full justify-start text-[0.8vw] pr-[1vw]'>
            <div className='flex'>
                <div className='flex flex-col gap-y-[0.2vh]'>
                    <label>Name</label>
                    <input
                        type='text'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className='bg-transparent border-white border-[0.1vw] p-[0.5vw]'
                    />
                </div>
            </div>
            <div className='flex justify-evenly gap-x-[1vw]'>
                <div className='flex flex-col gap-y-[0.2vh] w-1/4'>
                    <label>Pronouns</label>
                    <input
                        type='text'
                        value={pronouns}
                        onChange={(e) => setPronouns(e.target.value)}
                        className='bg-transparent border-white border-[0.1vw] p-[0.5vw] w-full'
                    />
                </div>
                <div className='flex flex-col gap-y-[0.2vh] w-1/4'>
                    <label>Age</label>
                    <input
                        type='text'
                        value={age}
                        onChange={(e) => setAge(Number(e.target.value))}
                        className='bg-transparent border-white border-[0.1vw] p-[0.5vw] w-full'
                    />
                </div>
                <div className='flex flex-col gap-y-[0.2vh] w-1/4'>
                    <label>Voice</label>
                    <input
                        type='text'
                        value={voice}
                        onChange={(e) => setVoice(e.target.value)}
                        className='bg-transparent border-white border-[0.1vw] p-[0.5vw] w-full'
                    />
                </div>
                <div className='flex flex-col gap-y-[0.2vh] w-1/4'>
                    <label>Alignment</label>
                    <input
                        type='text'
                        value={alignment}
                        onChange={(e) => setAlignment(e.target.value)}
                        className='bg-transparent border-white border-[0.1vw] p-[0.5vw] w-full'
                    />
                </div>
            </div>
            <div className='flex justify-evenly gap-x-[1vw]'>
                <div className='flex flex-col gap-y-[0.2vh] w-1/2'>
                    <label>Appearance</label>
                    <textarea
                        value={appearance}
                        onChange={(e) => setAppearance(e.target.value)}
                        className='bg-transparent border-white border-[0.1vw] p-[0.5vw] w-full h-[10vh]'
                    />
                </div>
                <div className='flex flex-col gap-y-[0.2vh] w-1/2'>
                    <label>Backstory</label>
                    <textarea
                        value={backstory}
                        onChange={(e) => setBackstory(e.target.value)}
                        className='bg-transparent border-white border-[0.1vw] p-[0.5vw] w-full h-[10vh]'
                    />
                </div>
            </div>
            <div className='flex justify-evenly gap-x-[1vw]'>
                <div className='flex flex-col gap-y-[0.2vh] w-full'>
                    <label>Personality Traits</label>
                    <textarea
                        value={personality}
                        onChange={(e) => setPersonality(e.target.value)}
                        className='bg-transparent border-white border-[0.1vw] p-[0.5vw] w-3/5 h-[10vh]'
                    />
                </div>
            </div>
            <div className='flex justify-evenly gap-x-[1vw]'>
                <div className='flex flex-col gap-y-[0.2vh] w-1/3'>
                    <label>Ideals</label>
                    <textarea
                        value={ideals}
                        onChange={(e) => setIdeals(e.target.value)}
                        className='bg-transparent border-white border-[0.1vw] p-[0.5vw] w-full h-[5vh]'
                    />
                </div>
                <div className='flex flex-col gap-y-[0.2vh] w-1/3'>
                    <label>Bonds</label>
                    <textarea
                        value={bonds}
                        onChange={(e) => setBonds(e.target.value)}
                        className='bg-transparent border-white border-[0.1vw] p-[0.5vw] w-full h-[5vh]'
                    />
                </div>
                <div className='flex flex-col gap-y-[0.2vh] w-1/3'>
                    <label>Flaws</label>
                    <textarea
                        value={flaws}
                        onChange={(e) => setFlaws(e.target.value)}
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
