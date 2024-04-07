import { User } from "database";
import { cn } from "@/lib/tailwind/utils";

type DiscordAvatarProps = {
    user: User;
    className?: string;
};

export function DiscordAvatar({ user, className }: DiscordAvatarProps) {
    const isMigratedUser = user.discriminator === "0";
    const defaultAvatarIndex = isMigratedUser
        ? (BigInt(user.id) >> BigInt(22)) % BigInt(6)
        : parseInt(user.discriminator) % 5;

    const hasAvatarDecoration = user.avatar_decoration != null;

    return (
        <div
            className={cn(
                "flex relative justify-center items-center aspect-square",
                className
            )}
        >
            {user.avatar ? (
                <>
                    <img
                        src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}${user.avatar.startsWith("a_") ? ".gif" : ".png"}`}
                        className='w-full h-full rounded-full'
                        alt='User Avatar'
                    />
                    {hasAvatarDecoration && (
                        <img
                            src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar_decoration}.png`}
                            className='absolute z-10 rounded-full w-[120%] h-[120%]'
                            style={{ transform: "translate(-50%, -50%)" }}
                            alt='Avatar Decoration'
                        />
                    )}
                </>
            ) : (
                <img
                    src={`https://cdn.discordapp.com/embed/avatars/${defaultAvatarIndex}.png`}
                    className='w-8 h-8 rounded-full'
                    alt='Default User Avatar'
                />
            )}
        </div>
    );
}
