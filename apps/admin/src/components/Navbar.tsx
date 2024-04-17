"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { linkGroups } from "@/app/(data)/index";
import { Separator } from "@/components/ui/separator";

export default function Navbar() {
    const pathname = usePathname();

    return (
        <div className='w-[250px] h-full border-r border-r-black flex flex-col'>
            {linkGroups.map((group, index) => (
                <Fragment key={index}>
                    <div className='p-4'>
                        <h3 className='font-bold'>{group.groupName}</h3>
                        <ul className='mt-2'>
                            {group.links.map((link, linkIndex) => (
                                <li
                                    key={linkIndex}
                                    className={`mt-1 cursor-pointer ${pathname === link.url ? "underline text-black" : "text-neutral-700 hover:underline"}`}
                                >
                                    <Link href={link.url}>{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {index < linkGroups.length - 1 && <Separator />}
                </Fragment>
            ))}
        </div>
    );
}
