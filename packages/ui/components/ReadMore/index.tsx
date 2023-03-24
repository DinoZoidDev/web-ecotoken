/*
 * Copyright (C) 2023 EcoToken Systems
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import React, { useEffect, useState } from "react";

const ReadMore: React.FC<React.PropsWithChildren & { len: number }> = ({
    children,
    len,
}) => {
    const text = children as string;
    const [isReadMore, setIsReadMore] = useState(true);
    const [isFlush, setIsFlush] = useState(false);

    const toggleReadMore = () => {
        setIsReadMore(!isReadMore);
    };

    useEffect(() => {
        console.log(text.length, len, text.length > len);
        if (text.length > len) setIsFlush(true);
        else setIsFlush(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <p className="text">
            {isReadMore ? text?.slice(0, len) : text}
            <span onClick={toggleReadMore} className="read-or-hide">
                {isReadMore ? (
                    isFlush && <span className="toggle-show">...See more</span>
                ) : (
                    <span className="toggle-show"> Show less</span>
                )}
            </span>
        </p>
    );
};

export default ReadMore;
