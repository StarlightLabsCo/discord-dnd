type NonStreamedMessageProps = {
    text: string;
};

export function NonStreamedMessage({ text }: NonStreamedMessageProps) {
    const content = text
        .split("\n")
        .map((line, i) => <div key={i}>{line}</div>);

    return <>{content}</>;
}
