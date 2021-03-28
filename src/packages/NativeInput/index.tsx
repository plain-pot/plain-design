import React from "react";
import {fixInputCursor} from "../../utils/fixInputCursor";

export const NativeInput = fixInputCursor<React.FC<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>>>('input' as any)
