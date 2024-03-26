import logo from "@/assets/logo.png";

export function LoadingScreen() {
    return (
        <div className='w-screen h-screen bg-[#01131D] flex justify-center items-center'>
            <img
                src={logo}
                className='w-[1024px] h-[1024px]'
                alt='Fantasy Fogo Logo'
            />
        </div>
    );
}
