import { MessageModel } from "./message.model";

export interface ChatIdMessages{
    chatId: string;
    messages: MessageModel[];
    doctorImageUrl: string;
    patientImageUrl: string;
    doctorName: string;
    patientName: string;
    isChatExisted: boolean;
}
