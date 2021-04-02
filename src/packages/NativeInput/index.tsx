import {fixInputCursor} from "plain-design-composition";
import React from "react";

export const NativeInput = fixInputCursor<React.FC<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>>>('input' as any)
