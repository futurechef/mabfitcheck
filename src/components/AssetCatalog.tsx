import React, { useState, useEffect, useMemo } from 'react';
import { FABRIC_SWATCHES } from '../constants/fabricSwatches';
import { SHIRTS } from '../constants/shirts';
import { SUITS } from '../constants';
import { ChangelogModal } from './ChangelogModal';

type AssetType = 'fabrics' | 'shirts' | 'suits';

interface ChangeRecord {
    assetType: AssetType;
    assetId: string;
    field: string;
    oldValue: string;
    newValue: string;
    timestamp: Date;
}

export type AssetCatalogChange = ChangeRecord;

export const AssetCatalog: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
    const [activeTab, setActiveTab] = useState<AssetType>('fabrics');
    const [changes, setChanges] = useState<ChangeRecord[]>([]);
    const [editingCell, setEditingCell] = useState<{ id: string; field: string } | null>(null);
    const [editValue, setEditValue] = useState('');

    const [searchTerm, setSearchTerm] = useState('');
    const [showChangelog, setShowChangelog] = useState(false);

    // Load saved changes from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('mab-asset-changes');
        if (saved) {
            const parsed = JSON.parse(saved);
            setChanges(parsed.map((c: any) => ({ ...c, timestamp: new Date(c.timestamp) })));
        }
    }, []);

    // Save changes to localStorage
    useEffect(() => {
        if (changes.length > 0) {
            localStorage.setItem('mab-asset-changes', JSON.stringify(changes));
        }
    }, [changes]);

    // Get modified values for display
    const getModifiedValue = (assetType: AssetType, assetId: string, field: string, originalValue: string) => {
        const change = changes.find(
            c => c.assetType === assetType && c.assetId === assetId && c.field === field
        );
        return change ? change.newValue : originalValue;
    };

    const isModified = (assetType: AssetType, assetId: string, field: string) => {
        return changes.some(c => c.assetType === assetType && c.assetId === assetId && c.field === field);
    };

    const handleEdit = (_assetType: AssetType, assetId: string, field: string, currentValue: string) => {
        setEditingCell({ id: assetId, field });
        setEditValue(currentValue);
    };

    const handleSave = (assetType: AssetType, assetId: string, field: string, originalValue: string) => {
        if (editValue !== originalValue) {
            // Remove any existing change for this field
            const filtered = changes.filter(
                c => !(c.assetType === assetType && c.assetId === assetId && c.field === field)
            );
            // Add new change
            setChanges([...filtered, {
                assetType,
                assetId,
                field,
                oldValue: originalValue,
                newValue: editValue,
                timestamp: new Date()
            }]);
        }
        setEditingCell(null);
    };

    const handleKeyDown = (e: React.KeyboardEvent, assetType: AssetType, assetId: string, field: string, originalValue: string) => {
        if (e.key === 'Enter') {
            handleSave(assetType, assetId, field, originalValue);
        } else if (e.key === 'Escape') {
            setEditingCell(null);
        }
    };

    const clearAllChanges = () => {
        if (changes.length === 0) return; // Guard clause
        if (confirm('Clear all changes? This cannot be undone.')) {
            setChanges([]);
            localStorage.removeItem('mab-asset-changes');
            setShowChangelog(false);
        }
    };



    // Filtered data based on search
    const filteredFabrics = useMemo(() => {
        if (!searchTerm) return FABRIC_SWATCHES;
        const term = searchTerm.toLowerCase();
        return FABRIC_SWATCHES.filter(f =>
            f.id.toLowerCase().includes(term) ||
            f.name.toLowerCase().includes(term) ||
            f.color.toLowerCase().includes(term) ||
            f.pattern.toLowerCase().includes(term)
        );
    }, [searchTerm]);

    const filteredShirts = useMemo(() => {
        if (!searchTerm) return SHIRTS;
        const term = searchTerm.toLowerCase();
        return SHIRTS.filter(s =>
            s.id.toLowerCase().includes(term) ||
            s.name.toLowerCase().includes(term) ||
            s.baseColor.toLowerCase().includes(term) ||
            s.pattern.toLowerCase().includes(term)
        );
    }, [searchTerm]);

    const filteredSuits = useMemo(() => {
        if (!searchTerm) return SUITS;
        const term = searchTerm.toLowerCase();
        return SUITS.filter(s =>
            s.id.toLowerCase().includes(term) ||
            s.name.toLowerCase().includes(term) ||
            s.color.toLowerCase().includes(term) ||
            s.pattern.toLowerCase().includes(term)
        );
    }, [searchTerm]);

    const renderEditableCell = (
        assetType: AssetType,
        assetId: string,
        field: string,
        originalValue: string
    ) => {
        const displayValue = getModifiedValue(assetType, assetId, field, originalValue);
        const modified = isModified(assetType, assetId, field);
        const isEditing = editingCell?.id === assetId && editingCell?.field === field;

        if (isEditing) {
            return (
                <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => handleSave(assetType, assetId, field, originalValue)}
                    onKeyDown={(e) => handleKeyDown(e, assetType, assetId, field, originalValue)}
                    autoFocus
                    className="w-full px-2 py-1 border-2 border-[#B8A66F] outline-none text-sm bg-white"
                />
            );
        }

        return (
            <div
                onClick={() => handleEdit(assetType, assetId, field, displayValue)}
                className={`cursor-pointer px-2 py-1 hover:bg-[#F5F5F0] rounded ${modified ? 'bg-yellow-50 border-l-4 border-yellow-400' : ''}`}
                title={modified ? `Originally: "${originalValue}"` : 'Click to edit'}
            >
                {displayValue}
                {modified && <span className="ml-2 text-[10px] text-yellow-600 font-bold">✏️</span>}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#F9F7F4]">
            {/* Header */}
            <div className="bg-white border-b border-[#EAEAEA] shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-serif text-[#1A1A1A]">Asset Verification Catalog</h1>
                            <p className="text-[10px] text-[#9A8A55] font-bold tracking-[0.3em] uppercase mt-1">
                                Tailor Review • {FABRIC_SWATCHES.length} Fabrics • {SHIRTS.length} Shirts • {SUITS.length} Suits
                            </p>
                        </div>
                        <div className="flex gap-3">
                            {onBack && (
                                <button
                                    onClick={onBack}
                                    className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[#666] border border-[#EAEAEA] hover:border-[#B8A66F]"
                                >
                                    ← Back
                                </button>
                            )}
                            {changes.length > 0 && (
                                <>
                                    <button
                                        onClick={clearAllChanges}
                                        className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-red-600 border border-red-200 hover:bg-red-50"
                                    >
                                        Clear All ({changes.length})
                                    </button>
                                    <button
                                        onClick={() => setShowChangelog(true)}
                                        className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest bg-[#1A1A1A] text-white hover:bg-[#B8A66F]"
                                    >
                                        Review Changes ({changes.length})
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs & Search */}
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex gap-2">
                        {(['fabrics', 'shirts', 'suits'] as AssetType[]).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-3 text-[11px] font-bold uppercase tracking-widest border transition-all ${activeTab === tab
                                    ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                                    : 'bg-white text-[#666] border-[#EAEAEA] hover:border-[#B8A66F]'
                                    }`}
                            >
                                {tab} ({tab === 'fabrics' ? FABRIC_SWATCHES.length : tab === 'shirts' ? SHIRTS.length : SUITS.length})
                            </button>
                        ))}
                    </div>
                    <input
                        type="text"
                        placeholder="Search by ID, name, color, pattern..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-4 py-2 border border-[#EAEAEA] text-sm w-80 focus:border-[#B8A66F] outline-none"
                    />
                </div>

                {/* Tables */}
                <div className="bg-white border border-[#EAEAEA] shadow-sm overflow-hidden">
                    <div className="overflow-x-auto max-h-[70vh] overflow-y-auto">
                        {activeTab === 'fabrics' && (
                            <table className="w-full text-sm">
                                <thead className="bg-[#F9F7F4] sticky top-0">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-[#666]">Image</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-[#666]">ID</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-[#666]">Name</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-[#666]">Mill</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-[#666]">Color</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-[#666]">Pattern</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredFabrics.map((fabric, i) => (
                                        <tr key={fabric.id} className={i % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'}>
                                            <td className="px-4 py-2">
                                                <img src={fabric.imageUrl} alt={fabric.name} className="w-12 h-12 object-cover border"
                                                    onError={(e) => (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48'} />
                                            </td>
                                            <td className="px-4 py-2 font-mono text-xs text-[#666]">{fabric.id}</td>
                                            <td className="px-4 py-2">{renderEditableCell('fabrics', fabric.id, 'name', fabric.name)}</td>
                                            <td className="px-4 py-2">{renderEditableCell('fabrics', fabric.id, 'mill', fabric.mill)}</td>
                                            <td className="px-4 py-2">{renderEditableCell('fabrics', fabric.id, 'color', fabric.color)}</td>
                                            <td className="px-4 py-2">{renderEditableCell('fabrics', fabric.id, 'pattern', fabric.pattern)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {activeTab === 'shirts' && (
                            <table className="w-full text-sm">
                                <thead className="bg-[#F9F7F4] sticky top-0">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-[#666]">Image</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-[#666]">ID</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-[#666]">Name</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-[#666]">Category</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-[#666]">Color</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-[#666]">Pattern</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-[#666]">Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredShirts.map((shirt, i) => (
                                        <tr key={shirt.id} className={i % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'}>
                                            <td className="px-4 py-2">
                                                <img src={shirt.imageUrl} alt={shirt.name} className="w-12 h-12 object-cover border"
                                                    onError={(e) => (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48'} />
                                            </td>
                                            <td className="px-4 py-2 font-mono text-xs text-[#666]">{shirt.id}</td>
                                            <td className="px-4 py-2">{renderEditableCell('shirts', shirt.id, 'name', shirt.name)}</td>
                                            <td className="px-4 py-2">{renderEditableCell('shirts', shirt.id, 'category', shirt.category)}</td>
                                            <td className="px-4 py-2">{renderEditableCell('shirts', shirt.id, 'baseColor', shirt.baseColor)}</td>
                                            <td className="px-4 py-2">{renderEditableCell('shirts', shirt.id, 'pattern', shirt.pattern)}</td>
                                            <td className="px-4 py-2">{renderEditableCell('shirts', shirt.id, 'price', shirt.price)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {activeTab === 'suits' && (
                            <table className="w-full text-sm">
                                <thead className="bg-[#F9F7F4] sticky top-0">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-[#666]">Image</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-[#666]">ID</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-[#666]">Name</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-[#666]">Category</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-[#666]">Color</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-[#666]">Pattern</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-[#666]">Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredSuits.map((suit, i) => (
                                        <tr key={suit.id} className={i % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'}>
                                            <td className="px-4 py-2">
                                                <img src={suit.imageUrl} alt={suit.name} className="w-12 h-12 object-cover border"
                                                    onError={(e) => (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48'} />
                                            </td>
                                            <td className="px-4 py-2 font-mono text-xs text-[#666]">{suit.id}</td>
                                            <td className="px-4 py-2">{renderEditableCell('suits', suit.id, 'name', suit.name)}</td>
                                            <td className="px-4 py-2">{renderEditableCell('suits', suit.id, 'category', suit.category)}</td>
                                            <td className="px-4 py-2">{renderEditableCell('suits', suit.id, 'color', suit.color)}</td>
                                            <td className="px-4 py-2">{renderEditableCell('suits', suit.id, 'pattern', suit.pattern)}</td>
                                            <td className="px-4 py-2">{renderEditableCell('suits', suit.id, 'price', suit.price)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Footer info */}
                <div className="mt-4 text-center text-[10px] text-[#999] uppercase tracking-widest">
                    Click any cell to edit • Changes saved locally • Download changelog for permanent record
                </div>
            </div>

            <ChangelogModal
                isOpen={showChangelog}
                onClose={() => setShowChangelog(false)}
                changes={changes}
                onClear={clearAllChanges}
            />
        </div>
    );
};
