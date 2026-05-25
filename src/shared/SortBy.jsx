export default function SortBy({
    sortBy,
    sortDirection,
    onSortByChange,
    onSortDirectionChange
}) {
    return (
        <div>
            <label htmlFor="sortBySelect">Sort By:</label>
            <select 
                id="sortBySelect" 
                value={sortBy} 
                onChange={(e) => onSortByChange(e.target.value)}
            >
                <option value="" disabled>Choose an Option</option>
                <option value="Creation Date">Creation Date</option>
                <option value="title">Title</option>
            </select>
            <label htmlFor="sortByDirection">Sort By:</label>
            <select 
                id="sortByDirection" 
                value={sortDirection} 
                onChange={(e) => onSortByChange(e.target.value)}
            >
                <option value="" disabled>Choose an Option</option>
                <option value='desc'>Descending</option>
                <option value='asc'>Ascending</option>
            </select>
        </div>
    )
}