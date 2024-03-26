import logo from "@/assets/logo.png";

export function LoadingScreen() {
    return (
        <div className='w-screen h-screen bg-[#01131D] flex justify-center items-center'>
            <img
                src={logo}
                className='w-[512px] h-[512px]'
                alt='Fantasy Fogo Logo'
            />
        </div>
    );
}
