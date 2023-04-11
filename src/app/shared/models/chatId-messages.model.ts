import { MessageModel } from "./message.model";

export interface ChatIdMessages{
    chatId: string;
    messages: MessageModel[];
}