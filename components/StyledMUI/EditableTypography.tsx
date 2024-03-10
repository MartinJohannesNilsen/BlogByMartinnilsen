import InputBase, { InputBaseProps } from "@mui/material/InputBase";
import Typography, { TypographyProps } from "@mui/material/Typography";
import * as React from "react";
import { useState } from "react";

export interface EditableTypographyProps {
	/**
	 * Handler calling when the text changed
	 */
	onChange?: (value: string) => void;
	placeholder?: string;
}

const InputBaseWithChildren = ({ children, ...props }: InputBaseProps & { children?: React.ReactNode }) => {
	let value = "";
	if (children) {
		if (typeof children == "string" || typeof children == "number") {
			value = children.toString();
		}
	}

	return <InputBase {...props} multiline className={""} value={value} inputProps={{ className: props.className }} />;
};

/**
 * Displaying like a `Typography`. But acting as an `input`
 */
const EditableTypography = ({ onChange: propsOnChange, ...props }: EditableTypographyProps & TypographyProps) => {
	const [internalValue, setInternalValue] = useState("");

	const value = props.children || internalValue;

	const onChange = (value: string) => {
		if (propsOnChange) {
			propsOnChange(value);
		}
		setInternalValue(value);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange(e.target.value);
	};

	return <Typography {...props} children={value} component={InputBaseWithChildren} onChange={handleChange} />;
};

export default EditableTypography;
