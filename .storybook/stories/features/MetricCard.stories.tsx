import type { Meta, StoryObj } from "@storybook/react";
import { MetricCard } from "@/components/analytics/MetricCard";

const meta: Meta<typeof MetricCard> = {
  title: "Features/MetricCard",
  component: MetricCard,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Auto-generated story for MetricCard component.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    // Add argTypes based on props analysis
    // This would be enhanced with more sophisticated prop analysis
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {
  args: {
    // Default props would be added here based on component analysis
  },
};

// Additional story variants
export const Primary: Story = {
  args: {
    // Primary variant props
  },
};

export const Secondary: Story = {
  args: {
    // Secondary variant props
  },
};

// Loading state (if applicable)
export const Loading: Story = {
  args: {
    // Loading state props
  },
};

// Error state (if applicable)
export const Error: Story = {
  args: {
    // Error state props
  },
};
