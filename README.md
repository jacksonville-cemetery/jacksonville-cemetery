# Jacksonville Cemetery Search

A comprehensive web application for searching and exploring historical cemetery records from Jacksonville, Oregon. Built with React, TypeScript, and modern web technologies.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/jacksonville-cemetery/jacksonville-cemetery.git
   cd jacksonville-cemetery
   ```

2. **Install dependencies and start the web app**
   ```bash
   cd cemetery-search
   pnpm install
   pnpm dev
   ```

3. **Open in browser**
   ```
   http://localhost:5173
   ```

### Alternative: Mobile App (React Native/Expo)
```bash
cd app
npm install
npx expo start
```

## 📊 Current Features

- ✅ **Advanced Search** - Search across names, dates, locations, places, and notes
- ✅ **Category Filtering** - Selective search in specific data categories
- ✅ **Sorting & Column Management** - Sort by any column, show/hide columns
- ✅ **Virtualization** - Handle large datasets efficiently with TableVirtuoso
- ✅ **Pagination** - Responsive pagination for non-virtualized view
- ✅ **Modern UI** - Built with Chakra UI v3 components
- ✅ **Responsive Design** - Works on desktop and mobile devices
- ✅ **Debounced Search** - Optimized search performance
- ✅ **Data Export Ready** - Structured JSON data format

## 🎯 Feature Roadmap

### 🔧 Data Quality & Management
- [ ] **Fix date formatting inconsistencies** (Priority: High)
  - [ ] Fix `01\26\1895` → `01/26/1895` format issues
  - [ ] Standardize all date formats across dataset
  - [ ] Add data validation warnings
- [ ] **Data validation and cleanup tools**
  - [ ] Detect and highlight data quality issues
  - [ ] Batch correction interface
- [ ] **Admin interface for data corrections**
- [ ] **Data export functionality** 
  - [ ] CSV export with current filters
  - [ ] PDF export for individual records
  - [ ] Print-friendly formatting

### 🔍 Search & Discovery Enhancements
- [ ] **Advanced search operators** (Priority: High)
  - [ ] `AND`, `OR`, `NOT` operators
  - [ ] Exact phrase matching with quotes
  - [ ] Wildcard support (`*`, `?`)
- [ ] **Fuzzy search for names**
  - [ ] Handle typos and spelling variations
  - [ ] Phonetic matching (Soundex/Metaphone)
- [ ] **Date range searches**
  - [ ] "Died between 1900-1910" syntax
  - [ ] Date picker interface
- [ ] **Relationship searches**
  - [ ] Find family members automatically
  - [ ] Spouse and children linking
- [ ] **Saved searches and bookmarks**
  - [ ] Local storage persistence
  - [ ] Shareable search URLs

### 🎨 User Experience
- [ ] **Dark/Light mode toggle** (Priority: High)
  - [ ] System preference detection
  - [ ] Persistent user preference
  - [ ] Smooth theme transitions
- [ ] **Enhanced mobile design**
  - [ ] Touch-optimized interactions
  - [ ] Mobile-first responsive layouts
- [ ] **Accessibility enhancements**
  - [ ] Screen reader compatibility
  - [ ] Keyboard navigation
  - [ ] High contrast mode
  - [ ] Focus indicators
- [ ] **Print-friendly record views** (Priority: High)
  - [ ] Dedicated print layouts
  - [ ] QR codes for digital access
  - [ ] Formatted cemetery record cards

### 🗺️ Visual & Interactive Features
- [ ] **Cemetery plot finder** (Priority: High)
  - [ ] Interactive cemetery map (GeoJSON)
  - [ ] Click-to-view plot details
  - [ ] Walking directions to plots
  - [ ] Google Maps integration option
  - [ ] GPS coordinates for plots
- [ ] **Individual person pages** (Priority: High)
  - [ ] Dedicated URLs for each person (`/person/[id]`)
  - [ ] Editable information fields
  - [ ] Photo upload capability
  - [ ] Family relationship display
  - [ ] Historical context section
- [ ] **Photo gallery for headstones**
  - [ ] Image upload and management
  - [ ] Before/after restoration photos
  - [ ] High-resolution zoom capability
- [ ] **Timeline view of burials**
  - [ ] Chronological visualization
  - [ ] Filter by date ranges
  - [ ] Historical events overlay
- [ ] **Statistics dashboard**
  - [ ] Burial trends over time
  - [ ] Demographics analysis
  - [ ] Popular names by era
- [ ] **Family tree visualization**
  - [ ] Interactive family connections
  - [ ] Multi-generational views

### 📚 Historical Context
- [ ] **Historical events overlay**
  - [ ] Mark records from Civil War, WWI, WWII
  - [ ] Epidemic/pandemic markers (1918 flu, etc.)
  - [ ] Local historical events
- [ ] **Veterans identification system**
  - [ ] Military service details
  - [ ] War participation tracking
  - [ ] Veterans memorial features
- [ ] **Immigration pattern analysis**
  - [ ] Birthplace clustering
  - [ ] Migration timeline visualization
- [ ] **Historical health insights**
  - [ ] Cause of death trends
  - [ ] Lifespan analysis by era
  - [ ] Disease outbreak correlation

### ⚡ Technical Improvements
- [ ] **Progressive Web App (PWA)**
  - [ ] Offline functionality
  - [ ] App-like installation
  - [ ] Service worker caching
- [ ] **Enhanced search performance**
  - [ ] Full-text search indexing
  - [ ] Search result caching
  - [ ] Elasticsearch integration option
- [ ] **API development**
  - [ ] REST API endpoints
  - [ ] GraphQL query interface
  - [ ] Rate limiting and authentication
- [ ] **Database migration**
  - [ ] Move from JSON to PostgreSQL/SQLite
  - [ ] Data relationship modeling
  - [ ] Migration scripts and tools
- [ ] **Automated backup and versioning**
  - [ ] Git-based data versioning
  - [ ] Automated daily backups
  - [ ] Change history tracking

## 🏗️ Project Structure

```
jacksonville-cemetery/
├── cemetery-search/          # React web application
│   ├── src/
│   │   ├── App.tsx          # Main application component
│   │   ├── components/ui/   # Chakra UI components
│   │   └── ...
│   ├── public/
│   │   └── cemetery_records_structured.json
│   └── package.json
├── app/                     # React Native mobile app
│   ├── app/                # Expo Router pages
│   ├── data/               # Cemetery data files
│   └── package.json
├── cemetery-data/          # Source documents and raw data
└── README.md
```

## 🛠️ Tech Stack

### Web Application
- **React 18** with TypeScript
- **Chakra UI v3** for components and theming
- **TanStack React Table** for advanced table functionality
- **React Virtuoso** for performance with large datasets
- **Vite** for build tooling and development

### Mobile Application
- **React Native** with Expo
- **TypeScript** for type safety
- **Expo Router** for navigation

### Data Management
- **JSON** structured data (migrating to database)
- **CSV** source data format
- **Git** for version control and data history

## 📝 Contributing

1. Pick a feature from the roadmap
2. Create a feature branch
3. Implement the feature with tests
4. Submit a pull request
5. Update this README with completed features

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Acknowledgments

- Historical data compiled from Jacksonville Cemetery records
- Built with modern web technologies for accessibility and performance
- Community-driven development for historical preservation

---

**Current Status**: ✅ Core search functionality complete | 🎯 Working on advanced features

*Last updated: July 13, 2025*
