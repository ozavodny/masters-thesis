import { type RefObject, useEffect, useState } from "react";
import { type Size } from "~/types/common.types";

export function useContainerSize<T extends HTMLElement | null>(containerRef: RefObject<T>) {
    const [containerSize, setContainerSize] = useState<Size>({
        width: 0,
        height: 0,
    })

    useEffect(() => {
        const handleResize = () => {
            const size = containerRef.current?.getBoundingClientRect()
            if (size) {
                setContainerSize({
                    width: size.width,
                    height: size.height,
                })
            }
        }

        handleResize()

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [containerRef])

    return containerSize
}