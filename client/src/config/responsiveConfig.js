// Central configuration for responsive layouts
// Based on Figma design: 1920x1080 with 1589x869 container

export const authLayoutConfig = {
  // Container responsive breakpoints - Targeting 1920px specifically
  container: {
    // Mobile first approach - REVERTED to original smaller sizes
    mobile: 'max-w-sm',        // 384px - Compact for phones
    tablet: 'max-w-2xl',       // 672px - Small tablets (REVERTED)
    tabletLg: 'max-w-4xl',     // 896px - Medium tablets (REVERTED)
    desktop: 'max-w-6xl',      // 1152px - Large screens (REVERTED)
    desktopXl: 'max-w-7xl',    // 1280px - Extra large screens (REVERTED)
    desktop2xl: 'max-w-figma', // 1589px - EXACT Figma specification for 1920px screens
  },

  // Container dimensions
  dimensions: {
    height: 'min(869px, 90vh)',   // Figma spec with viewport fallback
    minHeight: '600px',           // Minimum height for mobile
    maxWidth: '1589px',           // Figma container width (not used in classes but available)
  },

  // Container padding for different screen sizes - Reverted
  padding: {
    outer: 'p-2 sm:p-4 lg:p-6',                    // Main container padding (REVERTED)
    inner: 'p-8 sm:p-12 md:p-16 lg:p-8 xl:p-12',  // Form section padding
    brand: 'p-6 sm:p-8 lg:p-8 xl:p-12',           // Brand section padding
  },

  // Form specific configurations
  form: {
    maxWidth: 'max-w-xs sm:max-w-sm',           // Form container width
    spacing: 'space-y-4 sm:space-y-5 lg:space-y-6', // Form elements spacing
    titleMargin: 'mb-6 sm:mb-8 lg:mb-10',      // Title bottom margin
  },

  // Typography responsive classes
  typography: {
    title: 'text-2xl sm:text-3xl lg:text-3xl xl:text-4xl',  // Page title
    brandLogo: 'text-5xl sm:text-6xl lg:text-6xl xl:text-7xl 2xl:text-8xl', // MEX VISA
    brandWelcome: 'text-xl sm:text-2xl lg:text-2xl xl:text-3xl 2xl:text-4xl', // Welcome to
    brandSubtitle: 'text-2xl sm:text-3xl lg:text-3xl xl:text-3xl 2xl:text-4xl', // MexVisa
    input: 'text-sm sm:text-base lg:text-base',          // Input text
    button: 'text-sm sm:text-base',                      // Button text
    message: 'text-xs sm:text-sm',                       // Error/success messages
    instruction: 'text-xs sm:text-sm',                   // Instruction text
  },

  // Component specific styles
  input: {
    padding: 'px-4 py-3 sm:px-5 sm:py-4 lg:px-5 lg:py-4',
    classes: 'w-full bg-white/90 border border-blue-700 border-[1px] rounded-2xl text-gray-700 placeholder-gray-500 focus:outline-none transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed',
  },

  button: {
    padding: 'py-3 sm:py-4 px-4 sm:px-6',
    classes: 'w-full text-white font-semibold font-sans rounded-2xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
  },

  // Grid layout for auth pages
  grid: {
    container: 'grid grid-cols-1 lg:grid-cols-5 h-full',
    formSection: 'order-2 lg:order-1 lg:col-span-2',    // Form on left (desktop), bottom (mobile)
    brandSection: 'order-1 lg:order-2 lg:col-span-3',   // Brand on right (desktop), top (mobile)
  },

  // Common spacing values
  spacing: {
    brandMargin: 'mb-6 sm:mb-8 lg:mb-16',              // Brand section bottom margin
    brandLogoMargin: 'mb-4 sm:mb-6 lg:mb-8',           // Logo bottom margin
    brandTextSpacing: 'space-y-1 sm:space-y-2 lg:space-y-3', // Welcome text spacing
    buttonTopMargin: 'pt-2 sm:pt-3 lg:pt-4',           // Button top margin
  },
}

// Color configuration
export const authColors = {
  primary: '#5576D9',      // Primary blue
  primaryHover: '#4a6bc7', // Hover state
  title: '#1B3276',       // Title color
  background: {
    form: 'rgba(255, 255, 255, 0.57)',    // Form section background
    brand: '#5576D9',                      // Brand section background
    container: 'bg-white/15',              // Main container background
  },
}

// Utility function to generate container classes - Updated for exact Figma width
export const getContainerClasses = () => {
  const { container } = authLayoutConfig
  return `w-full ${container.mobile} sm:${container.tablet} md:${container.tabletLg} lg:${container.desktop} xl:${container.desktopXl} 2xl:${container.desktop2xl}`
}

// Utility function to get container styles
export const getContainerStyles = () => {
  const { dimensions } = authLayoutConfig
  return {
    height: dimensions.height,
    minHeight: dimensions.minHeight,
  }
} 