export type Message<TType extends string, TData extends {} = {}> = {
    type: TType;
    data: TData;
}

export type ClientCommand = Message<"StartGame"> |
    Message<"UpdatePosition", { x: number, y: number }>

export type ServerEvent = Message<"GameStarted"> |
    Message<"PositionUpdated", { x: number, y: number }>


export function handleMessage(message: ClientCommand, send: (message: ServerEvent) => void) {

    const { type } = message;

    if (type === "StartGame") {
        console.log("Game started");
    }
    else if (type === "UpdatePosition") {
        const { data } = message;
        send({
            type: "PositionUpdated",
            data
        });
    }
}