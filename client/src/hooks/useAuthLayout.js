import { authLayoutConfig, authColors, getContainerClasses, getContainerStyles } from '../config/responsiveConfig'

 
export const useAuthLayout = () => {
  return {
    // Main container configuration
    container: {
      classes: `${getContainerClasses()} ${authColors.background.container} backdrop-blur-sm rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl`,
      styles: getContainerStyles(),
      padding: authLayoutConfig.padding.outer,
    },

    // Grid layout classes
    grid: {
      container: authLayoutConfig.grid.container,
      formSection: authLayoutConfig.grid.formSection,
      brandSection: authLayoutConfig.grid.brandSection,
    },

    // Form section configuration
    form: {
      containerClasses: `flex flex-col justify-center relative h-full`,
      padding: authLayoutConfig.padding.inner,
      background: authColors.background.form,
      backdropFilter: 'blur(10.1px)',
      
      // Form content wrapper
      contentWrapper: `relative z-10 w-full ${authLayoutConfig.form.maxWidth} mx-auto`,
      
      // Form elements
      formClasses: authLayoutConfig.form.spacing,
      titleMargin: authLayoutConfig.form.titleMargin,
    },

    // Brand section configuration
    brand: {
      containerClasses: `flex flex-col justify-center items-center text-white relative overflow-hidden h-full`,
      padding: authLayoutConfig.padding.brand,
      background: authColors.background.brand,
      
      // Content spacing
      contentMargin: authLayoutConfig.spacing.brandMargin,
      logoMargin: authLayoutConfig.spacing.brandLogoMargin,
      textSpacing: authLayoutConfig.spacing.brandTextSpacing,
      
      // Background pattern (for loginbg2.png)
      backgroundPattern: {
        classes: 'absolute bottom-0 w-full h-1/2 bg-contain bg-no-repeat bg-center',
        style: {
          backgroundImage: `url('/loginbg2.png')`,
          backgroundSize: '75% auto',
        }
      }
    },

    // Typography classes
    typography: {
      title: `${authLayoutConfig.typography.title} font-semibold font-sans mb-2`,
      brandLogo: `${authLayoutConfig.typography.brandLogo} font-bold font-sans tracking-wider`,
      brandWelcome: `${authLayoutConfig.typography.brandWelcome} font-light font-sans`,
      brandSubtitle: `${authLayoutConfig.typography.brandSubtitle} font-bold font-sans`,
      input: authLayoutConfig.typography.input,
      button: authLayoutConfig.typography.button,
      message: `${authLayoutConfig.typography.message} font-medium`,
      instruction: `${authLayoutConfig.typography.instruction} font-sans font-normal`,
    },

    // Component styles and classes
    components: {
      input: {
        classes: `${authLayoutConfig.input.classes} ${authLayoutConfig.input.padding} ${authLayoutConfig.typography.input}`,
        focusStyle: {
          focusRingColor: authColors.primary,
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        },
        focusBoxShadow: `0 0 0 3px rgba(85, 118, 217, 0.1)`,
        blurBoxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      },

      button: {
        classes: `${authLayoutConfig.button.classes} ${authLayoutConfig.button.padding} ${authLayoutConfig.typography.button}`,
        style: {
          backgroundColor: authColors.primary,
        },
        hoverColor: authColors.primaryHover,
        topMargin: authLayoutConfig.spacing.buttonTopMargin,
      },

      message: {
        error: `text-red-600 ${authLayoutConfig.typography.message} bg-red-50 p-2 sm:p-3 rounded-lg border border-red-200`,
        success: `text-green-600 ${authLayoutConfig.typography.message} bg-green-50 p-2 sm:p-3 rounded-lg border border-green-200`,
      },

      spinner: {
        small: 'h-4 w-4 sm:h-5 sm:w-5',
        medium: 'h-5 w-5',
      }
    },

    // Colors for inline styles
    colors: authColors,

    // Raw config access (if needed for custom implementations)
    config: authLayoutConfig,
  }
}

export default useAuthLayout 