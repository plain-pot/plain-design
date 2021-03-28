import React from "react";
import {fixInputCursor} from "../NativeInput";

export const NativeTextarea = fixInputCursor<React.FC<React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>>>('textarea' as any)