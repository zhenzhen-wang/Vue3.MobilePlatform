import type { App } from 'vue';
// 在使用函数组件时，unplugin-vue-components 无法自动引入对应的样式，因此需要手动引入样式
// import 'vant/es/toast/style';
// import 'vant/es/dialog/style';
// import 'vant/es/notify/style';
// import 'vant/es/image-preview/style';

import {
  Button,
  Toast,
  Grid,
  GridItem,
  Notify,
  Sidebar,
  SidebarItem,
  List,
  Cell,
  NavBar,
  Form,
  Field,
  Uploader,
  Tabbar,
  TabbarItem,
  Search,
  Tab,
  Tabs,
  Tag,
  Empty,
  SwipeCell,
  Card,
  CellGroup,
  Icon,
  NoticeBar,
  ConfigProvider,
  Image,
  Checkbox,
  Divider,
  Picker,
  DatetimePicker,
  Popup,
  Switch,
  Dialog,
  CheckboxGroup,
  Loading,
  Overlay,
  RadioGroup,
  Radio,
  ImagePreview,
  Skeleton,
  PasswordInput,
  NumberKeyboard,
} from 'vant';

export function registerGlobVant(app: App<Element>) {
  app.use(Button);
  app.use(Toast);
  app.use(Grid);
  app.use(GridItem);
  app.use(Notify);
  app.use(Sidebar);
  app.use(SidebarItem);
  app.use(List);
  app.use(Cell);
  app.use(NavBar);
  app.use(Form);
  app.use(Field);
  app.use(Uploader);
  app.use(Tabbar);
  app.use(TabbarItem);
  app.use(Search);
  app.use(Tab);
  app.use(Tabs);
  app.use(Tag);
  app.use(Empty);
  app.use(SwipeCell);
  app.use(Card);
  app.use(CellGroup);
  app.use(Icon);
  app.use(NoticeBar);
  app.use(ConfigProvider);
  app.use(Image);
  app.use(Checkbox);
  app.use(Divider);
  app.use(Picker);
  app.use(DatetimePicker);
  app.use(Popup);
  app.use(Switch);
  app.use(Dialog);
  app.use(CheckboxGroup);
  app.use(Loading);
  app.use(Overlay);
  app.use(RadioGroup);
  app.use(Radio);
  app.use(ImagePreview);
  app.use(Skeleton);
  app.use(PasswordInput);
  app.use(NumberKeyboard);
}
