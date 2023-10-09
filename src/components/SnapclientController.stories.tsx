import type { Meta, StoryObj } from "@storybook/react";

import SnapclientController from "./SnapclientController";

const component = SnapclientController;

const meta: Meta<typeof component> = {
  component,
};

type Story = StoryObj<typeof component>;

export default meta;

export const Primary: Story = {
  args: {},
};
