
import React from 'react';

interface TopBarProps {
    onBackToMenu: () => void;
    onOpenSettings: () => void;
}

const TopBarButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, ...props }) => (
    <button
        className="flex items-center gap-2 px-3 py-1.5 rounded-md font-semibold text-sm text-gray-300 bg-black/20 border border-gray-600 hover:bg-gray-700 hover:text-white transition-all duration-200"
        {...props}
    >
        {children}
    </button>
);

const TopBar: React.FC<TopBarProps> = ({ onBackToMenu, onOpenSettings }) => {
    return (
        <div className="w-full flex justify-between items-center mb-2 sm:mb-4 px-1">
            <TopBarButton onClick={onBackToMenu}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z" clipRule="evenodd" />
                </svg>
                Menu
            </TopBarButton>
            <TopBarButton onClick={onOpenSettings}>
                Settings
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                   <path d="M5 4a1 1 0 00-2 0v2.5a1 1 0 002 0V4zM5 10a1 1 0 00-2 0v6a1 1 0 002 0v-6zM10 4a1 1 0 00-2 0v6a1 1 0 002 0V4zM10 13.5a1 1 0 00-2 0V16a1 1 0 002 0v-2.5zM15 4a1 1 0 00-2 0v2.5a1 1 0 002 0V4zM15 10a1 1 0 00-2 0v6a1 1 0 002 0v-6z" />
                </svg>
            </TopBarButton>
        </div>
    );
};

export default TopBar;
