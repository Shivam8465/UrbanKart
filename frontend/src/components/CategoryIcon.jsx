import React from 'react';
import { ShowerHead, Wrench, PaintRoller } from 'lucide-react';

const CategoryIcon = ({ name, className }) => {
    switch (name) {
        case "Sanitary":
            return <ShowerHead className={className} />;
        case "Hardware":
            return <Wrench className={className} />;
        case "Paints":
            return <PaintRoller className={className} />;
        default:
            return null;
    }
};

export default CategoryIcon;

