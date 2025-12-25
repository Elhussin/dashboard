"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Option = {
    value: string | number;
    label: string;
};

type MultiSelectProps = {
    options: Option[];
    value: (string | number)[];
    onChange: (value: (string | number)[]) => void;
    label: string;
    placeholder?: string;
};

export default function MultiSelect({
    options,
    value,
    onChange,
    label,
    placeholder = "Select...",
}: MultiSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);

    const filteredOptions = options.filter((opt) =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleOption = (optValue: string | number) => {
        if (value.includes(optValue)) {
            onChange(value.filter((v) => v !== optValue));
        } else {
            onChange([...value, optValue]);
        }
    };

    const removeValue = (optValue: string | number, e: React.MouseEvent) => {
        e.stopPropagation();
        onChange(value.filter((v) => v !== optValue));
    };

    return (
        <div className="space-y-2 relative" ref={containerRef}>
            <label className="text-sm font-medium text-slate-400 ml-1">{label}</label>
            <div
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl min-h-[50px] px-3 py-2 cursor-pointer focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500 transition-all flex flex-wrap gap-2 items-center"
                onClick={() => setIsOpen(!isOpen)}
            >
                {value.length === 0 && (
                    <span className="text-slate-600">{placeholder}</span>
                )}

                {value.map((v) => {
                    const opt = options.find((o) => o.value === v);
                    return (
                        <span
                            key={v}
                            className="bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-lg px-2 py-1 text-sm flex items-center gap-1"
                        >
                            {opt?.label || v}
                            <button
                                onClick={(e) => removeValue(v, e)}
                                className="hover:text-blue-100"
                            >
                                &times;
                            </button>
                        </span>
                    );
                })}

                <div className="ml-auto pointer-events-none text-slate-500">
                    ▼
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-50 w-full mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden max-h-60 flex flex-col"
                    >
                        <div className="p-2 border-b border-slate-700">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                        <div className="overflow-y-auto flex-1 p-1">
                            {filteredOptions.length === 0 ? (
                                <div className="text-slate-500 text-sm p-2 text-center">
                                    No options found
                                </div>
                            ) : (
                                filteredOptions.map((opt) => (
                                    <div
                                        key={opt.value}
                                        onClick={() => toggleOption(opt.value)}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors ${value.includes(opt.value)
                                                ? "bg-blue-600/20 text-blue-300"
                                                : "text-slate-300 hover:bg-slate-700/50"
                                            }`}
                                    >
                                        <div
                                            className={`w-4 h-4 rounded border flex items-center justify-center ${value.includes(opt.value)
                                                    ? "bg-blue-500 border-blue-500"
                                                    : "border-slate-500"
                                                }`}
                                        >
                                            {value.includes(opt.value) && (
                                                <span className="text-white text-xs">✓</span>
                                            )}
                                        </div>
                                        {opt.label}
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
