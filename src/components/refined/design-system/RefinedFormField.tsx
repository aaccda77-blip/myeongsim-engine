'use client';

import React from 'react';

interface RefinedFormFieldProps {
    label: string;
    helper?: string;
    rightElement?: React.ReactNode;
    children: React.ReactNode;
}

export function RefinedFormField({
    label,
    helper,
    rightElement,
    children
}: RefinedFormFieldProps) {
    return (
        <div className="space-y-1.5 text-left">
            <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#9AA7B7] ml-0.5">
                    {label}
                </label>
                {rightElement && <div>{rightElement}</div>}
            </div>
            {children}
            {helper && (
                <p className="text-[11px] text-gray-400 ml-0.5">
                    {helper}
                </p>
            )}
        </div>
    );
}
