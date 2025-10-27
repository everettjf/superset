import { useState } from "react";

interface Tab {
	id: string;
	title: string;
	icon?: string;
	url?: string;
	type: "terminal" | "browser" | "folder";
}

interface TabGroup {
	id: string;
	name: string;
	tabs: Tab[];
	isCollapsed?: boolean;
}

interface SidebarProps {
	onTabSelect: (tabId: string) => void;
	activeTabId?: string;
	onCollapse: () => void;
}

export function Sidebar({
	onTabSelect,
	activeTabId,
	onCollapse,
}: SidebarProps) {
	// Stub tab groups data
	const [tabGroups, setTabGroups] = useState<TabGroup[]>([
		{
			id: "group-1",
			name: "Development",
			isCollapsed: false,
			tabs: [
				{ id: "1", title: "Terminal", type: "terminal" },
				{ id: "2", title: "localhost:3000", type: "browser", url: "http://localhost:3000" },
				{ id: "3", title: "API Docs", type: "browser", url: "http://localhost:4000/docs" },
			],
		},
		{
			id: "group-2",
			name: "Research",
			isCollapsed: false,
			tabs: [
				{ id: "4", title: "GitHub", type: "browser", url: "https://github.com" },
				{ id: "5", title: "Stack Overflow", type: "browser", url: "https://stackoverflow.com" },
			],
		},
		{
			id: "group-3",
			name: "Project Files",
			isCollapsed: true,
			tabs: [
				{ id: "6", title: "/src", type: "folder" },
				{ id: "7", title: "/docs", type: "folder" },
			],
		},
	]);

	const toggleGroupCollapse = (groupId: string) => {
		setTabGroups((groups) =>
			groups.map((group) =>
				group.id === groupId
					? { ...group, isCollapsed: !group.isCollapsed }
					: group
			)
		);
	};

	const getTabIcon = (type: Tab["type"]) => {
		switch (type) {
			case "terminal":
				return "▶︎";
			case "browser":
				return "◉";
			case "folder":
				return "📁";
			default:
				return "•";
		}
	};

	return (
		<div className="flex flex-col h-full w-64 select-none bg-neutral-900 text-neutral-300 border-r border-neutral-800">
			{/* Top Section - Matches window controls height */}
			<div
				className="flex items-center border-b border-neutral-800"
				style={{ height: "48px", paddingLeft: "88px" }}
			>
				<button
					onClick={onCollapse}
					className="p-2 rounded opacity-70 hover:opacity-100 hover:bg-neutral-800 transition-all"
				>
					<svg
						width="16"
						height="16"
						viewBox="0 0 16 16"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M10 4L6 8L10 12"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</button>
			</div>

			{/* Tabs Section */}
			<div className="flex-1 overflow-y-auto px-3 py-2 space-y-3">
				{/* New Tab Button */}
				<button className="w-full flex items-center gap-2 px-3 py-2 rounded text-sm opacity-70 hover:opacity-100 hover:bg-neutral-800 transition-all">
					<span>+</span>
					<span>New Tab</span>
				</button>

				{/* Tab Groups */}
				{tabGroups.map((group) => (
					<div key={group.id} className="space-y-1">
						{/* Group Header */}
						<button
							onClick={() => toggleGroupCollapse(group.id)}
							className="w-full flex items-center gap-2 px-2 py-1 rounded text-xs font-medium opacity-60 hover:opacity-100 hover:bg-neutral-800 transition-all"
						>
							<svg
								width="12"
								height="12"
								viewBox="0 0 12 12"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								className={`transition-transform ${group.isCollapsed ? "" : "rotate-90"}`}
							>
								<path
									d="M4 3L7 6L4 9"
									stroke="currentColor"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
							<span className="truncate">{group.name}</span>
							<span className="ml-auto text-neutral-500">{group.tabs.length}</span>
						</button>

						{/* Group Tabs */}
						{!group.isCollapsed && (
							<div className="space-y-1 pl-2">
								{group.tabs.map((tab) => (
									<button
										key={tab.id}
										onClick={() => onTabSelect(tab.id)}
										className={`w-full flex items-center gap-2 px-3 py-2 rounded text-sm transition-all ${
											activeTabId === tab.id
												? "opacity-100 bg-neutral-800 border border-neutral-700"
												: "opacity-70 hover:opacity-100 hover:bg-neutral-800"
										}`}
									>
										<span>{getTabIcon(tab.type)}</span>
										<span className="truncate">{tab.title}</span>
									</button>
								))}
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
}
