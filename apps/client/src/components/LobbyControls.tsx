import { MusicControlsButton } from "./MusicControlsButton";
import { SettingsButton } from "./SettingsButton";

export function LobbyControls() {
    return (
        <div className='flex items-center justify-end w-full gap-x-4'>
            <MusicControlsButton />
            <SettingsButton />
        </div>
    );
}
