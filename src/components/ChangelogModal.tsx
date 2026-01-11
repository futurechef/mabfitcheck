import React, { useState } from 'react';
import type { AssetCatalogChange } from './AssetCatalog';
import { XIcon } from './icons';
import { motion, AnimatePresence } from 'framer-motion';

interface ChangelogModalProps {
    isOpen: boolean;
    onClose: () => void;
    changes: AssetCatalogChange[];
    onClear: () => void;
}

export const ChangelogModal: React.FC<ChangelogModalProps> = ({ isOpen, onClose, changes, onClear }) => {
    const [activeTab, setActiveTab] = useState<'markdown' | 'json'>('markdown');
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const generateMarkdown = () => {
        const date = new Date().toISOString().split('T')[0];
        let md = `# MAB Asset Catalog Changes (${date})\n\n`;

        (['fabrics', 'shirts', 'suits'] as const).forEach(type => {
            const typeChanges = changes.filter(c => c.assetType === type);
            if (typeChanges.length > 0) {
                md += `## ${type.charAt(0).toUpperCase() + type.slice(1)} (${typeChanges.length})\n`;
                typeChanges.forEach(c => {
                    md += `- **${c.assetId}** \`${c.field}\`: "${c.oldValue}" → "${c.newValue}"\n`;
                });
                md += '\n';
            }
        });
        return md;
    };

    const generateJSON = () => {
        // Group by asset type for easier consumption
        const grouped = {
            fabrics: changes.filter(c => c.assetType === 'fabrics'),
            shirts: changes.filter(c => c.assetType === 'shirts'),
            suits: changes.filter(c => c.assetType === 'suits'),
        };
        return JSON.stringify(grouped, null, 2);
    };

    const content = activeTab === 'markdown' ? generateMarkdown() : generateJSON();

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const blob = new Blob([content], { type: activeTab === 'markdown' ? 'text/markdown' : 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mab-changes-${new Date().toISOString().split('T')[0]}.${activeTab === 'markdown' ? 'md' : 'json'}`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="bg-white rounded-xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Review Pending Changes</h2>
                            <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-bold">
                                {changes.length} Pending Updates
                            </p>
                        </div>
                        <div className="flex bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
                            <button
                                onClick={() => setActiveTab('markdown')}
                                className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${activeTab === 'markdown' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-50'
                                    }`}
                            >
                                Reader View
                            </button>
                            <button
                                onClick={() => setActiveTab('json')}
                                className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${activeTab === 'json' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-50'
                                    }`}
                            >
                                Developer JSON
                            </button>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                            <XIcon className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-grow overflow-hidden bg-[#1e1e1e]">
                        <pre className="w-full h-full p-6 overflow-auto font-mono text-sm text-gray-300 leading-relaxed custom-scrollbar">
                            {content}
                        </pre>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center bg-white">
                        <button
                            onClick={onClear}
                            className="text-xs font-bold text-red-600 hover:text-red-700 uppercase tracking-wider transition-colors"
                        >
                            Clear All Changes
                        </button>

                        <div className="flex gap-3">
                            <button
                                onClick={handleDownload}
                                className="px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-gray-700 border border-gray-200 rounded-lg hover:border-gray-400 transition-all"
                            >
                                Download File
                            </button>
                            <button
                                onClick={handleCopy}
                                className={`px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white rounded-lg transition-all shadow-lg transform active:scale-95 ${copied ? 'bg-green-600' : 'bg-[#1A1A1A] hover:bg-[#B8A66F]'
                                    }`}
                            >
                                {copied ? 'Copied!' : 'Copy to Clipboard'}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
