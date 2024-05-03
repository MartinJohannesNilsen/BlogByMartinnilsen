"use client";
import EditorJS from "@editorjs/editorjs";
import DragDrop from "editorjs-drag-drop";
import Undo from "editorjs-undo";
import { memo, useEffect, useRef } from "react";
import { EditorBlockProps } from "../../types";
import { EDITOR_JS_TOOLS } from "./tools";

const EditorBlock = ({ data, onChange, holder }: EditorBlockProps) => {
	//add a reference to editor
	const ref = useRef<EditorJS>();

	//initialize editorjs
	useEffect(() => {
		//initialize editor if we don't have a reference
		if (!ref.current) {
			const editor = new EditorJS({
				holder: holder,
				tools: EDITOR_JS_TOOLS,
				data,
				// @ts-ignore
				logLevel: "ERROR",
				onReady: () => {
					if (editor) {
						new Undo({ editor });
						new DragDrop(editor);
					}
				},
				async onChange(api, event) {
					const data = await api.saver.save();
					onChange(data);
				},
			});
			ref.current = editor;
		}
		//add a return function handle cleanup
		return () => {
			if (ref.current && ref.current.destroy) {
				ref.current.destroy();
			}
		};
	}, []);
	return <div id={holder} />;
};
export default memo(EditorBlock);
