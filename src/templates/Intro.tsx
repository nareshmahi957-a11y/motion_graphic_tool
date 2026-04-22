import { getInputProps } from 'remotion';

export const Intro = () => {
    const { text, color } = getInputProps(); // Injected from user input
    return <h1 style={{ color }}>{text}</h1>;
};
